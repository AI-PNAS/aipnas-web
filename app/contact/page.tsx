import Header from '@/app/components/Header';

export default function ContactPage() {
  const links = [
    { label: 'Telegram', href: 'https://t.me/campusppt' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/belay-k-54743720a' },
    { label: 'Facebook', href: 'https://facebook.com/belaykassanew.wasie' },
    { label: 'Instagram', href: 'https://instagram.com/belaykassanew' },
    { label: 'Telegram Group', href: 'https://t.me/+5pqSNuCO18syZjg0' },
    { label: 'Website', href: 'https://belaykassanew.netlify.app' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="contact" />
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Contact</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Start a conversation with AI-PNAS.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold">Organizations</h2>
            <p className="mt-3 leading-7 text-slate-600">Use an existing AI-PNAS account to identify your organization and role before requesting a facility or NGO onboarding review.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold">Clinical safety</h2>
            <p className="mt-3 leading-7 text-slate-600">AI-PNAS supports screening and professional review. It does not replace emergency care or qualified clinical diagnosis.</p>
          </div>
        </div>
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-950">Connect with Belay Kassanew</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
