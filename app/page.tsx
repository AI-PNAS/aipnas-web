import Link from 'next/link';
import Image from 'next/image';

const steps = [
  { title: 'Register child', description: 'Create a child profile with basic demographics and health context.' },
  { title: 'Capture measurements', description: 'Enter or estimate weight, height, and MUAC for analysis.' },
  { title: 'AI-assisted review', description: 'Use the pediatric nutrition engine to assess growth patterns and risk.' },
  { title: 'Professional review', description: 'Clinicians verify the findings and determine follow-up actions.' },
];

const services = [
  { title: 'Pediatric Nutrition Assessment', description: 'Screen growth and nutritional risk with real back-end analysis.' },
  { title: 'Growth Monitoring', description: 'Track a child’s trend over time and compare history.' },
  { title: 'AI-assisted Measurement', description: 'Support capture with guidance and confidence checks.' },
  { title: 'Assessment History', description: 'Review stored results and historical records in one place.' },
];

const childStories = [
  { src: '/public/images/aipnas-logo.png/a.png', alt: 'Child nutrition assessment with caregiver', label: 'Early visibility' },
  { src: '/public/images/aipnas-logo.png/ai.png', alt: 'Child receiving care and nutrition support', label: 'Focused support' },
  { src: '/public/images/aipnas-logo.png/b.png', alt: 'Community child nutrition monitoring', label: 'Community care' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo/ai-pnas-logo.png" alt="AI PNAS logo" width={1254} height={1254} priority className="h-[52px] w-auto md:h-[72px]" />
            </Link>

            <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <Link href="/" className="text-slate-900">Home</Link>
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/services" className="hover:text-slate-900">Services</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                Login
              </Link>
              <Link href="/login?mode=register" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600">
                Create Account
              </Link>
            </div>
          </header>

          <div className="mt-16 grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                AI-assisted pediatric nutrition assessment
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                Supporting safer child growth monitoring.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                AI PNAS helps families and health professionals review child measurements, monitor nutritional risk,
                and support follow-up with AI-assisted screening and professional oversight.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/login?mode=register" className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
                  Start Assessment
                </Link>
                <Link href="/about" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Learn How It Works
                </Link>
              </div>
              <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-3">
                {[
                  ['WHO-based', 'growth standards'],
                  ['AI-assisted', 'measurement support'],
                  ['Human review', 'clinical oversight'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-xl shadow-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">Nutrition assessment</p>
                  <h2 className="mt-2 text-2xl font-semibold">Child Growth Profile</h2>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Active
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/15 text-2xl">👧</div>
                  <div>
                    <p className="font-semibold">Child profile</p>
                    <p className="text-sm text-slate-300">24 months · Female</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Weight', '10.8 kg'],
                    ['Height', '84.5 cm'],
                    ['MUAC', '14.2 cm'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-slate-800 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-2 text-base font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Growth assessment</p>
                  <p className="text-sm font-semibold text-emerald-300">Normal range</p>
                </div>
                <div className="mt-4 flex h-16 items-end gap-2">
                  {[35, 52, 56, 68, 82].map((height, index) => (
                    <span
                      key={index}
                      className="w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-cyan-300"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="child-story-section border-b border-slate-200 bg-[#071a23] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">Why early action matters</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Make difficult nutrition cases visible sooner.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">AI PNAS helps care teams turn measurements into a clear next step for every child.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {childStories.map((story, index) => (
              <figure key={story.src} className="child-story-card" style={{ animationDelay: `${index * 180}ms` }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800">
                  <Image src={story.src} alt={story.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <figcaption className="mt-3 text-sm font-semibold text-teal-100">{story.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">A simple flow for child growth assessment.</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">Key services</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Support the full child nutrition workflow.</h2>
            </div>
            <Link href="/services" className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex">
              Explore services
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">AI + Human</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">AI assists. Health professionals decide.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">AI-assisted screening</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Analyze anthropometric measurements and review growth-related indicators.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">Confidence information</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Maintain transparency around measurement quality and AI support.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">Manual verification</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Allow trained professionals to confirm, edit, or override estimates.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">Professional review</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Keep decisions under appropriate clinical guidance and follow-up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
        <div className="rounded-[2rem] border border-teal-100 bg-teal-50 p-8 text-center md:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Start monitoring child growth with AI PNAS.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login?mode=register" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Create Account
            </Link>
            <Link href="/login" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-semibold text-slate-900">AI PNAS</p>
            <p className="mt-1">AI-assisted pediatric nutritional assessment.</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/services" className="hover:text-slate-900">Services</Link>
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
            <Link href="#" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
