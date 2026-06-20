function ProgressBar({ label, value, accent }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
