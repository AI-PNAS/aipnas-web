import Header from '@/app/components/Header';
import Link from 'next/link';

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="donate" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Child screening support</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Donate for Child Screening</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          AI-PNAS does not currently process donations in this application. For verified partnership or funding opportunities, contact the project team through the partner and contact pages.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/partners" className="rounded-full bg-blue-700 px-6 py-3 font-bold text-white">Partners</Link>
          <Link href="/contact" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800">Contact</Link>
        </div>
      </section>
    </main>
  );
}
