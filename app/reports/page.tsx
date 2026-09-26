import AppShell from '@/app/components/layout/AppShell';
import StatePanel from '@/app/components/ui/StatePanel';

export default function ReportsPage() {
  return (
    <AppShell
      title="Reports"
      subtitle="Assessment and growth reports for follow-up"
      navItems={[
        { href: '/clinical', label: 'Dashboard' },
        { href: '/register', label: 'Assessments' },
        { href: '/reports', label: 'Reports' },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {['Child assessment report', 'Growth monitoring report', 'Assessment history report'].map((title) => (
          <article key={title} className="app-card p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Includes child information, measurements, WHO indicators, AI-assisted measurements, manual verification fields, and clinical review notes.
            </p>
            <button type="button" className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
              Prepare report
            </button>
          </article>
        ))}
      </section>
      <div className="mt-6">
        <StatePanel
          title="PDF export integration"
          description="Report PDF generation is pending backend integration. The report templates are ready for service wiring."
          tone="empty"
        />
      </div>
    </AppShell>
  );
}
