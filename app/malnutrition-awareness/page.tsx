import Header from '@/app/components/Header';
import Link from 'next/link';

export default function MalnutritionAwarenessPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="malnutrition-awareness" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Early awareness</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Malnutrition Awareness</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Early nutrition screening can identify children who need further measurement and professional assessment. Seek urgent clinical review for bilateral pitting oedema or severe danger signs.
        </p>
        <Link href="/register" className="mt-8 inline-flex rounded-full bg-red-600 px-6 py-3 font-bold text-white">Begin Screening</Link>
      </section>
    </main>
  );
}
