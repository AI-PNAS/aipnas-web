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
  { src: '/public/images/aipnas-logo.png/ai.png', alt: 'Child receiving care and nutrition support', label: 'Early Visibility', title: 'Child receiving care and nutrition support' },
  { src: '/public/images/aipnas-logo.png/b.png', alt: 'Community child nutrition monitoring', label: 'Focused Support', title: 'Community child nutrition monitoring' },
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

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="homepage-hero-text">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <span className="h-2 w-2 rounded-full bg-red-500 nutrition-alert-pulse" />
                Early nutrition screening
              </div>
              <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
                Your Child&apos;s Nutrition Matters.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Detect malnutrition early. Support healthy growth. Help protect every child.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login?mode=register" className="inline-flex min-h-14 items-center justify-center rounded-full bg-blue-700 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800">
                  Start Child Nutrition Screening
                </Link>
                <Link href="/about" className="inline-flex min-h-14 items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                  How It Works
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['WHO-aligned screening', 'Offline-ready workflow', 'Human review'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="homepage-hero-photo relative">
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-300/60">
                <Image
                  src="/public/images/aipnas-logo.png/ai.png"
                  alt="Child receiving respectful care and nutrition support"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="homepage-photo-zoom object-cover"
                />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/40 bg-slate-950/75 p-4 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-200">Early screening</p>
                  <p className="mt-1 text-lg font-semibold">Notice changes. Act earlier.</p>
                </div>
              </div>
              <div className="homepage-risk-indicator absolute -right-2 top-8 rounded-2xl border border-red-200 bg-white px-4 py-3 shadow-xl shadow-red-100">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-red-600 shadow-sm" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-red-700">Act early</p>
                    <p className="mt-0.5 text-xs text-slate-600">Screen + review</p>
                  </div>
                </div>
              </div>
              <div className="homepage-arrow absolute -left-8 top-28 hidden items-center gap-2 text-blue-700 lg:flex" aria-hidden="true">
                <span className="text-4xl">↘</span>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold">Screen early</span>
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
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {childStories.map((story, index) => (
              <figure key={story.src} className="child-story-card" style={{ animationDelay: `${index * 180}ms` }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800">
                  <Image src={story.src} alt={story.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <figcaption className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">{story.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{story.title}</p>
                </figcaption>
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
