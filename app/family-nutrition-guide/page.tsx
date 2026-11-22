import Header from '@/app/components/Header';
import Link from 'next/link';

export default function FamilyNutritionGuidePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="family-nutrition-guide" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Family nutrition</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Family Nutrition Guide</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Use regular, varied meals and age-appropriate feeding practices. Seek guidance from a qualified health worker for a child with poor growth, feeding difficulty, or visible nutritional danger signs.
        </p>
        <Link href="/register" className="mt-8 inline-flex rounded-full bg-blue-700 px-6 py-3 font-bold text-white">Start Nutrition Screening</Link>
      </section>
    </main>
  );
}
