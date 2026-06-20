import { Link } from 'react-router-dom';

const features = [
  'AI-powered resume scoring and feedback',
  'Job role matching with keyword suggestions',
  'ATS compatibility insights',
  'Download actionable PDF feedback',
  'Modern responsive dashboard design',
];

function LandingPage() {
  return (
    <section className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300">
            AI Resume Analytics for modern hiring
          </span>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Build better resumes with intelligent feedback and ATS-ready insights.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Upload your resume, choose your target job role, and get a complete analysis with personalized suggestions, keyword gaps, and score breakdowns.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/upload" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              Start analyzing
            </Link>
            <Link to="/dashboard" className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-300">
              View sample dashboard
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-slate-700/80 p-8 shadow-soft">
          <div className="grid gap-6">
            <div className="rounded-3xl bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Score snapshot</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-white">
                  <span>Overall ATS compatibility</span>
                  <span className="text-lg font-semibold">87%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-4/5 rounded-full bg-sky-500" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {features.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card rounded-[2rem] p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <div className="mt-8 space-y-6 text-slate-300">
            <div>
              <p className="font-semibold text-white">1. Upload your resume</p>
              <p className="mt-2 text-sm">Drag and drop your PDF or DOCX resume. The system extracts the text instantly.</p>
            </div>
            <div>
              <p className="font-semibold text-white">2. Choose a job role</p>
              <p className="mt-2 text-sm">Select the target role to match keywords with hiring expectations.</p>
            </div>
            <div>
              <p className="font-semibold text-white">3. Review recommendations</p>
              <p className="mt-2 text-sm">Get AI-driven suggestions, ATS feedback, and a detailed score breakdown.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 shadow-soft bg-slate-900/90">
          <h2 className="text-2xl font-semibold text-white">What you get</h2>
          <ul className="mt-8 space-y-4 text-slate-300">
            <li className="rounded-3xl bg-slate-950/90 p-5">
              <p className="font-semibold text-white">Score breakdown</p>
              <p className="mt-2 text-sm">See skills, education, projects, and role matching scores.</p>
            </li>
            <li className="rounded-3xl bg-slate-950/90 p-5">
              <p className="font-semibold text-white">ATS compatibility</p>
              <p className="mt-2 text-sm">Understand how your resume performs for applicant tracking systems.</p>
            </li>
            <li className="rounded-3xl bg-slate-950/90 p-5">
              <p className="font-semibold text-white">AI feedback</p>
              <p className="mt-2 text-sm">Get recommendations for keywords, metrics, and bullet improvements.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
