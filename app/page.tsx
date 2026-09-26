import Link from 'next/link';
import StatusBadge from '@/app/components/ui/StatusBadge';

const sections = [
  {
    id: 'problem',
    title: 'The problem',
    description:
      'Nutritional risk in children is often identified late because assessments are fragmented and follow-up is inconsistent.',
  },
  {
    id: 'how-it-works',
    title: 'How AI PNAS works',
    description:
      'AI-assisted measurement, anthropometric data, WHO-oriented indicators, and clinical review are combined in one workflow.',
  },
  {
    id: 'human-loop',
    title: 'AI + human workflow',
    description:
      'When confidence is high, AI supports faster screening. When confidence is low, manual clinical verification is required.',
  },
  {
    id: 'family',
    title: 'Family experience',
    description:
      'Families can follow growth status, trends, and follow-up advice using simple language in English and Amharic.',
  },
  {
    id: 'professional',
    title: 'Health professional experience',
    description:
      'Clinicians get structured intake, AI confidence visibility, patient history, and review-ready screening summaries.',
  },
  {
    id: 'growth',
    title: 'Growth monitoring',
    description:
      'Longitudinal measurement views support trend awareness and early attention for children who need follow-up.',
  },
  {
    id: 'safety',
    title: 'Safety and responsible AI',
    description:
      'AI PNAS provides screening support and does not replace professional clinical assessment or diagnostic judgment.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">AI PNAS</p>
            <h1 className="text-xl font-semibold">Pediatric nutrition platform</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800">
              Explore AI PNAS
            </Link>
            <Link href="/register" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white">
              Start assessment
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6">
        <div className="space-y-4">
          <StatusBadge tone="info">AI-assisted pediatric screening</StatusBadge>
          <h2 className="text-4xl font-semibold leading-tight">Smarter pediatric nutrition assessment. Earlier support.</h2>
          <p className="text-slate-600">
            AI PNAS combines AI-assisted assessment, anthropometric measurements, WHO growth standards, and human clinical oversight to support earlier identification of nutritional risk.
          </p>
          <div className="flex gap-3">
            <Link href="/register" className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white">
              Start assessment
            </Link>
            <Link href="/clinical" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
              Explore AI PNAS
            </Link>
          </div>
        </div>
        <article className="app-card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Product preview</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">AI measurement confidence</p>
              <p className="text-2xl font-semibold text-teal-700">94%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Follow-up required</p>
              <p className="text-2xl font-semibold text-amber-700">8 children</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
              <p className="text-xs text-slate-500">Latest screening note</p>
              <p className="mt-1 text-sm text-slate-700">
                AI confidence is insufficient for MUAC. Clinician verification requested before final screening output.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 md:grid-cols-2 md:px-6">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="app-card p-5">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{section.description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <article className="status-note rounded-lg p-5">
          AI PNAS provides AI-assisted screening support and does not replace professional clinical assessment.
        </article>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 md:px-6">
          <span>© {new Date().getFullYear()} AI PNAS</span>
          <div className="flex gap-3">
            <Link href="/family" className="hover:text-slate-900">
              Family experience
            </Link>
            <Link href="/clinical" className="hover:text-slate-900">
              Health professional experience
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
