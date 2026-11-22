import Header from '@/app/components/Header';
import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    { title: 'Child nutrition screening', text: 'Use the concise nutrition assessment workflow.', href: '/register' },
    { title: 'About WHO-informed assessment', text: 'Understand the clinical scope and safety principles.', href: '/about' },
    { title: 'Service capabilities', text: 'Review caregiver, professional, and organization services.', href: '/services' },
  ];
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="resources" />
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Resources</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Practical nutrition screening resources.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {resources.map((resource) => (
            <Link key={resource.title} href={resource.href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h2 className="text-xl font-bold">{resource.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{resource.text}</p>
              <span className="mt-5 inline-block font-bold text-blue-700">Open →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
