import Header from '@/app/components/Header';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="terms" />
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Terms</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Terms of Use</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          AI-PNAS is clinical decision support for authorized users and does not replace professional diagnosis or emergency care. Users are responsible for verifying measurements, informed consent, referrals, and applicable local clinical and data-protection requirements.
        </p>
      </section>
    </main>
  );
}
