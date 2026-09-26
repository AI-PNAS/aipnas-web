interface StatePanelProps {
  title: string;
  description: string;
  tone?: 'info' | 'error' | 'empty';
}

const toneClassMap: Record<NonNullable<StatePanelProps['tone']>, string> = {
  info: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  empty: 'border-slate-200 bg-white text-slate-700',
};

export default function StatePanel({ title, description, tone = 'info' }: StatePanelProps) {
  return (
    <section className={`app-card border p-5 ${toneClassMap[tone]}`}>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{description}</p>
    </section>
  );
}
