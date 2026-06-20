import ProgressBar from '../components/ProgressBar';

const sampleMetrics = [
  { label: 'Skills strength', value: 82, accent: 'bg-sky-500' },
  { label: 'Experience presence', value: 73, accent: 'bg-emerald-500' },
  { label: 'Projects count', value: 65, accent: 'bg-violet-500' },
  { label: 'Education relevance', value: 78, accent: 'bg-amber-500' },
  { label: 'Job match', value: 70, accent: 'bg-pink-500' },
];

function DashboardPage() {
  return (
    <section className="space-y-10">
      <div className="glass-card rounded-[2rem] p-10 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Resume diagnostics</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Dashboard preview</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Review the analytics and see how the resume performs across ATS and target job role match categories.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm text-slate-300">Overall score</p>
              <p className="mt-3 text-5xl font-semibold text-white">78</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm text-slate-300">ATS compatibility</p>
              <p className="mt-3 text-5xl font-semibold text-white">88%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="glass-card rounded-[2rem] p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Score overview</h2>
          <div className="mt-8 space-y-6">
            {sampleMetrics.map((metric) => (
              <ProgressBar key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Resume highlights</h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li className="rounded-3xl bg-slate-950/90 p-5">Strong skills section with focus on modern frameworks.</li>
            <li className="rounded-3xl bg-slate-950/90 p-5">Projects need more measurable impact statements.</li>
            <li className="rounded-3xl bg-slate-950/90 p-5">ATS score is high, but keywords can be improved.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
