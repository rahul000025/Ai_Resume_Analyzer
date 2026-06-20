function StatisticCard({ title, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6 shadow-soft">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-300/80">{title}</p>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      {detail && <p className="mt-3 text-sm text-slate-300">{detail}</p>}
    </div>
  );
}

export default StatisticCard;
