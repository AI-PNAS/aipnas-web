import Link from 'next/link';
import Header from '@/app/components/Header';

const pillars = [
  'Computer vision-assisted anthropometric assessment',
  'WHO-informed growth monitoring and interpretation',
  'AI-assisted screening support for clinical review',
  'Human verification and responsible follow-up decisions',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="about" />

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">About AI PNAS</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            AI-assisted support for safer pediatric growth monitoring.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            AI PNAS helps families and health professionals track child growth, assess nutritional risk,
            and review measurements with a clear clinical workflow. It is designed to support early,
            practical decisions without replacing professional assessment.
          </p>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">The problem</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Malnutrition and growth problems in children can be difficult to detect early when monitoring
              is inconsistent, fragmented, or based only on routine checkups. In many settings, families and
              clinicians need a simple way to gather reliable measurements and review trends over time.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Our approach</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-slate-600">
              {pillars.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-teal-100 bg-teal-50 p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Responsible AI</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            AI PNAS provides AI-assisted screening support and does not replace professional clinical
            assessment. Results should be reviewed by an appropriately trained health professional before
            treatment or referral decisions are made.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              View services
            </Link>
            <Link href="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
              Create account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
