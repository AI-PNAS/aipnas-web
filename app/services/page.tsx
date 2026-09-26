import Link from 'next/link';
import Header from '@/app/components/Header';

const services = [
  {
    title: 'Child registration',
    description: 'Register child profiles, demographics, and health context in a structured workflow.',
    href: '/register',
  },
  {
    title: 'Nutrition assessment',
    description: 'Analyze anthropometric measurements with the real nutrition engine and WHO-informed logic.',
    href: '/register',
  },
  {
    title: 'Growth monitoring',
    description: 'Track ongoing trends across children and historical assessments using real stored records.',
    href: '/dashboard',
  },
  {
    title: 'AI-assisted review',
    description: 'Use measurement assistance with confidence checks and professional verification steps.',
    href: '/dashboard',
  },
  {
    title: 'Professional verification',
    description: 'Allow trained reviewers to confirm estimates, document findings, and follow up appropriately.',
    href: '/dashboard',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="services" />

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <section className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Services</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Functional pediatric nutrition services.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Every service below connects to the application’s actual workflow, data, or review process.
          </p>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Service
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">{service.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{service.description}</p>
              <Link href={service.href} className="mt-6 inline-flex rounded-full border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                Open flow
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
