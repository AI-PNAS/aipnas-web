import Header from '@/app/components/Header';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const revalidate = 300;

export default async function GlobalImpactPage() {
  let registered = 0;
  let assessed = 0;
  let sam = 0;
  let mam = 0;

  try {
    [registered, assessed, sam, mam] = await Promise.all([
      prisma.child.count(),
      prisma.child.count({ where: { nutritionStatus: { not: null } } }),
      prisma.child.count({ where: { nutritionStatus: 'SAM' } }),
      prisma.child.count({ where: { nutritionStatus: 'MAM' } }),
    ]);
  } catch (error) {
    console.warn('Aggregate global-impact counts unavailable:', error);
  }

  const cards = [
    { label: 'Registered child profiles', value: registered },
    { label: 'Completed assessments', value: assessed },
    { label: 'SAM screenings', value: sam },
    { label: 'MAM screenings', value: mam },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="global-impact" />
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Public global impact</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Aggregated impact, without identifiable child records.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          These public figures are non-identifying aggregate counts. Individual children, locations, and clinical details require authorized access.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{card.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/login?mode=register" className="rounded-full bg-blue-700 px-6 py-3 font-bold text-white">Create Account</Link>
          <Link href="/resources" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800">View Resources</Link>
        </div>
      </section>
    </main>
  );
}
