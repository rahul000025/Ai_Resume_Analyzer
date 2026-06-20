const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const path = require('path');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const jobRoles = {
  'Software Developer': ['software development', 'javascript', 'react', 'node.js', 'api', 'backend', 'frontend', 'git'],
  'Data Analyst': ['data analysis', 'sql', 'excel', 'python', 'tableau', 'power bi', 'statistics', 'visualization'],
  'Product Manager': ['product management', 'roadmap', 'stakeholders', 'user research', 'agile', 'scrum', 'communication'],
};

const extractTextFromDocument = async (buffer, originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type');
};

const parseResumeSections = (text) => {
  const normalized = text.replace(/\r/g, '\n').replace(/\n{2,}/g, '\n\n');
  const lines = normalized.split(/\n/).map((line) => line.trim()).filter(Boolean);

  const sections = {
    skills: [],
    education: [],
    experience: [],
    projects: [],
    summary: [],
  };

  let current = 'summary';
  const sectionKeywords = {
    skills: ['skill', 'technical skills', 'tools', 'technologies'],
    education: ['education', 'academic', 'degree', 'university', 'school'],
    experience: ['experience', 'work experience', 'professional experience', 'employment'],
    projects: ['project', 'projects'],
  };

  lines.forEach((line) => {
    const lowered = line.toLowerCase();
    if (Object.entries(sectionKeywords).some(([key, keywords]) => keywords.some((keyword) => lowered.includes(keyword)))) {
      const section = Object.entries(sectionKeywords).find(([key, keywords]) => keywords.some((keyword) => lowered.includes(keyword)))[0];
      current = section;
    }
    sections[current].push(line);
  });

  return sections;
};

const computeScore = ({ sections, role, keywords }) => {
  const skillsCount = sections.skills.length;
  const projectsCount = sections.projects.length;
  const experienceCount = sections.experience.length;
  const educationCount = sections.education.length;

  const matchedKeywords = sections.skills.reduce((count, line) => {
    const text = line.toLowerCase();
    return count + keywords.filter((keyword) => text.includes(keyword)).length;
  }, 0);

  const experienceScore = Math.min(20, experienceCount * 5);
  const projectsScore = Math.min(20, projectsCount * 7);
  const educationScore = Math.min(20, educationCount * 5 + 10);
  const skillsScore = Math.min(25, skillsCount * 3 + matchedKeywords * 2);
  const roleMatchScore = Math.min(15, matchedKeywords * 2);

  let total = experienceScore + projectsScore + educationScore + skillsScore + roleMatchScore;
  if (total > 100) total = 100;

  return {
    total,
    metrics: {
      skillsScore,
      projectsScore,
      experienceScore,
      educationScore,
      roleMatchScore,
      matchedKeywords,
    },
  };
};

const computeMatchPercentage = (keywords, text) => {
  if (!keywords.length) return 0;
  const matched = keywords.filter((keyword) => text.toLowerCase().includes(keyword)).length;
  return Math.round((matched / keywords.length) * 100);
};

const computeAtsCompatibility = ({ missingSkills, sections }) => {
  const sectionBonus = Math.min(100, (sections.experience.length ? 25 : 10) + (sections.projects.length ? 25 : 10) + (sections.skills.length ? 25 : 10) + (sections.education.length ? 25 : 10));
  const keywordPenalty = Math.min(100, missingSkills.length * 10);
  return Math.max(40, Math.min(100, sectionBonus - keywordPenalty + 20));
};

const buildPrompt = ({ text, role }) => {
  return `You are an expert resume reviewer. Analyze the following resume text for the role ${role} and return a strict JSON object:

- summary: concise evaluation of skills, experience, education, and projects.
- missingKeywords: an array of keywords missing for the target role.
- bulletSuggestions: 3 suggestions to improve bullet points with measurable achievements.
- atsAdvice: a short ATS compatibility recommendation.
- overallAdvice: one strong actionable recommendation.

Resume Text:
${text}

Only return valid JSON with the keys summary, missingKeywords, bulletSuggestions, atsAdvice, overallAdvice.`;
};

const analyzeResume = async (text, role) => {
  if (!openai) {
    return {
      summary: 'OpenAI API key is not configured. Resume suggestions are unavailable.',
      missingKeywords: [],
      bulletSuggestions: ['Set OPENAI_API_KEY in the backend environment to enable AI-powered suggestions.'],
      atsAdvice: 'Unable to compute ATS advice without AI configuration.',
      overallAdvice: 'Configure the OpenAI API key and restart the backend to unlock full analysis.',
    };
  }

  const prompt = buildPrompt({ text, role });
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a resume analysis assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.data.choices[0]?.message?.content?.trim() || '';
  try {
    return JSON.parse(content);
  } catch (parseError) {
    return {
      summary: 'Unable to parse AI response. Here is the raw feedback.',
      missingKeywords: [],
      bulletSuggestions: [content],
      atsAdvice: 'Review the output above for details.',
      overallAdvice: 'Use the AI response to improve your resume structure and keyword match.',
    };
  }
};

const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    const text = await extractTextFromDocument(req.file.buffer, req.file.originalname);
    const sections = parseResumeSections(text);

    res.json({
      text,
      sections,
      message: 'Resume extracted successfully.',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload and parse resume.' });
  }
};

const handleAnalyze = async (req, res) => {
  try {
    const { text, role } = req.body;
    if (!text || !role) {
      return res.status(400).json({ error: 'Resume text and job role are required.' });
    }

    const sections = parseResumeSections(text);
    const keywords = jobRoles[role] || [];
    const scoreResult = computeScore({ sections, role, keywords });
    const aiFeedback = await analyzeResume(text, role);

    const missingSkills = keywords.filter((keyword) => !text.toLowerCase().includes(keyword));
    const matchPercentage = computeMatchPercentage(keywords, text);
    const atsCompatibility = computeAtsCompatibility({ missingSkills, sections });
    res.json({
      score: scoreResult.total,
      metrics: scoreResult.metrics,
      sections,
      missingSkills,
      aiFeedback,
      role,
      matchPercentage,
      atsCompatibility,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume.' });
  }
};

module.exports = { handleUpload, handleAnalyze };
