import Header from '@/app/components/Header';

export default function ChildGrowthDevelopmentPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="child-growth-development" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Growth and development</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Child Growth &amp; Development</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Growth monitoring combines accurate measurements, repeated assessments, and professional interpretation. This page explains the purpose of growth monitoring but does not replace a child-health consultation.
        </p>
      </section>
    </main>
  );
}
