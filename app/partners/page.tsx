import Header from '@/app/components/Header';
import Link from 'next/link';

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="partners" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Partners</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Build responsible nutrition-screening partnerships.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          AI-PNAS is designed for health facilities, community health programs, NGOs, researchers, and public-health partners.
        </p>
        <Link href="/contact" className="mt-8 inline-flex rounded-full bg-blue-700 px-6 py-3 font-bold text-white">Discuss a Partnership</Link>
      </section>
    </main>
  );
}
