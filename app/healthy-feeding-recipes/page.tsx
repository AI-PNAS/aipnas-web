import Header from '@/app/components/Header';

export default function HealthyFeedingRecipesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="healthy-feeding-recipes" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Healthy feeding</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Healthy Feeding &amp; Recipes</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Locally available, nutrient-dense foods and safe feeding practices should be adapted to the child&apos;s age, culture, allergies, and clinical guidance. Follow facility or public-health nutrition recommendations for SAM or MAM cases.
        </p>
      </section>
    </main>
  );
}
