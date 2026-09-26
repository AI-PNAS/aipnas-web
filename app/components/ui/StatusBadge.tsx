interface StatusBadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

const toneClassMap: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  info: 'bg-cyan-50 text-cyan-800 border-cyan-200',
};

export default function StatusBadge({ tone = 'neutral', children }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClassMap[tone]}`}>
      {children}
    </span>
  );
}
