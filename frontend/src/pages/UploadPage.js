import { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import UploadDropzone from '../components/UploadDropzone';
import StatisticCard from '../components/StatisticCard';

const roles = ['Software Developer', 'Data Analyst', 'Product Manager'];

function UploadPage() {
  const [fileName, setFileName] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelected = async (file) => {
    setError('');
    setLoading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeText(response.data.text);
      setAnalysis(null);
    } catch (uploadError) {
      setError(uploadError.response?.data?.error || uploadError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError('Upload a resume before analyzing.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        text: resumeText,
        role: selectedRole,
      });
      setAnalysis(response.data);
    } catch (analyzeError) {
      setError(analyzeError.response?.data?.error || analyzeError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!analysis) return;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const lines = [];

    lines.push(`AI Resume Analysis Report`);
    lines.push(`Role: ${analysis.role}`);
    lines.push(`Overall Score: ${analysis.score}/100`);
    lines.push(`ATS Compatibility: ${analysis.atsCompatibility || 'N/A'}%`);
    lines.push(`Job Match: ${analysis.matchPercentage || 'N/A'}%`);
    lines.push(` `);
    lines.push(`Missing Skills: ${analysis.missingSkills.join(', ')}`);
    lines.push(` `);
    lines.push(`AI Summary:`);
    lines.push(analysis.aiFeedback.summary || analysis.aiFeedback);
    lines.push(` `);
    lines.push(`Bullet Suggestions:`);
    (analysis.aiFeedback.bulletSuggestions || []).forEach((suggestion, index) => {
      lines.push(`${index + 1}. ${suggestion}`);
    });
    lines.push(` `);
    lines.push(`ATS Advice:`);
    lines.push(analysis.aiFeedback.atsAdvice || '');
    lines.push(` `);
    lines.push(`Overall Advice:`);
    lines.push(analysis.aiFeedback.overallAdvice || '');

    let y = 40;
    lines.forEach((line) => {
      const split = doc.splitTextToSize(line, 520);
      split.forEach((text) => {
        if (y > 720) {
          doc.addPage();
          y = 40;
        }
        doc.text(text, 40, y);
        y += 18;
      });
    });
    doc.save('resume-analysis-report.pdf');
  };

  return (
    <div className="space-y-10">
      <div className="glass-card rounded-[2rem] p-10 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="text-3xl font-semibold text-white">Upload your resume</h1>
            <p className="mt-3 text-slate-300">Upload a PDF or DOCX file, then analyze it for role fit, keywords, and ATS readiness.</p>
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-950/90 p-6">
            <label className="block text-sm font-medium text-slate-300">Select job role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!resumeText || loading}
              className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        </div>
      </div>

      <UploadDropzone onFileSelected={handleFileSelected} />

      {error && (
        <div className="rounded-3xl border border-red-600 bg-red-500/10 px-6 py-4 text-sm text-red-200">{error}</div>
      )}

      {fileName && (
        <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
          <p className="font-medium text-slate-100">Uploaded File</p>
          <p className="mt-1 text-sm">{fileName}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <StatisticCard title="Overall Score" value={`${analysis.score}/100`} detail="Improvement areas highlighted below." />
            <StatisticCard title="ATS Score" value={`${analysis.atsCompatibility || 0}%`} detail="Measures resume readability for ATS." />
            <StatisticCard title="Job Match" value={`${analysis.matchPercentage || 0}%`} detail="Keyword relevance for selected role." />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="glass-card rounded-[2rem] p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-white">AI Feedback</h2>
              <p className="mt-4 whitespace-pre-line text-slate-300">{analysis.aiFeedback.summary || analysis.aiFeedback}</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex rounded-3xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Download PDF Report
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="glass-card rounded-[2rem] p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-white">Section breakdown</h3>
              <div className="mt-6 space-y-4 text-slate-300">
                {Object.entries(analysis.sections).map(([section, items]) => (
                  <div key={section} className="rounded-3xl bg-slate-950/90 p-5">
                    <p className="font-semibold text-white capitalize">{section}</p>
                    <p className="mt-3 text-sm text-slate-300">{items.length} entries detected.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-white">Missing skills</h3>
              <div className="mt-5 space-y-3">
                {analysis.missingSkills.length ? (
                  analysis.missingSkills.map((skill) => (
                    <div key={skill} className="rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-300">No missing skills detected for this role.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
