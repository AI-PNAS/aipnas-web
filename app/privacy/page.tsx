import Header from '@/app/components/Header';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="privacy" />
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Privacy</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          AI-PNAS limits collection to information needed for authorized nutrition screening and program management. Child health information must be handled with appropriate consent, role-based access, secure transmission, retention controls, and audit review.
        </p>
      </section>
    </main>
  );
}
