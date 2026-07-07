import Link from 'next/link';
import ChildList from '@/app/components/ChildList';

const portals = [
  {
    title: 'Parent Portal',
    subtitle: 'Simple intake and screening for families',
    description: 'Start a child profile, enter measurements, and receive a clear nutrition report.',
    href: '/register',
    accent: 'text-cyan-200',
  },
  {
    title: 'Health Professional Portal',
    subtitle: 'Clinical assessment and review',
    description: 'Capture vitals, history, signs, and analysis in one guided workflow.',
    href: '/register',
    accent: 'text-emerald-200',
  },
  {
    title: 'Organization Portal',
    subtitle: 'Oversight and program tracking',
    description: 'Monitor child records, risk trends, and reporting from the live dashboard.',
    href: '#children',
    accent: 'text-violet-200',
  },
];

const founders = [
  {
    name: 'Belay Kassanew',
    role: 'Public Health Student',
    strengths: 'Nutrition, Public Health, Health Systems, Community Health',
  },
  {
    name: 'Nahom',
    role: 'Data Science Student',
    strengths: 'Artificial Intelligence, Machine Learning, Data Analytics',
  },
  {
    name: 'Addisu Yirdaw',
    role: 'Computer Science Student',
    strengths: 'Software Development, Mobile Applications, System Architecture',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#06111c] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] text-cyan-200">AI-PNAS</p>
            <h1 className="text-lg font-semibold text-white md:text-2xl">Pediatric nutrition platform</h1>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#overview" className="transition hover:text-white">Overview</a>
            <a href="#portals" className="transition hover:text-white">Portals</a>
            <a href="#children" className="transition hover:text-white">Dashboard</a>
            <a href="#founders" className="transition hover:text-white">Founders</a>
          </nav>

          <Link href="/register" className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Start
          </Link>
        </div>
      </header>

      <section id="overview" className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:py-16">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Privacy-first, three-portal healthcare infrastructure
          </div>

          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl">
              AI-PNAS supports child screening, clinical review, and organization oversight.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              The home page now acts as a live entry point to the backend-driven workflow, not a text-only brochure.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Live backend', 'Reads saved children and risk levels from the database.'],
              ['Functional flow', 'Registration saves intake and generates analysis.'],
              ['WHO output', 'Auto-calculated score flags and recommendations.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold text-cyan-200">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Status</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Three portals ready</h3>
            </div>
            <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Online</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Parent Portal', 'Child intake and quick screening'],
              ['Health Professional Portal', 'Clinical assessment and review'],
              ['Organization Portal', 'Operations and monitoring'],
              ['Backend API', 'Database persistence and analysis'],
            ].map(([label, description]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              Open Intake
            </Link>
            <a href="#children" className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              View Records
            </a>
          </div>
        </div>
      </section>

      <section id="portals" className="mx-auto max-w-7xl px-6 py-4 md:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {portals.map((portal) => (
            <div key={portal.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-slate-950/30">
              <p className={`text-sm uppercase tracking-[0.35em] ${portal.accent}`}>{portal.title}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{portal.subtitle}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{portal.description}</p>
              <Link href={portal.href} className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Open portal
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="children" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Dashboard</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Live child records</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              These records are loaded directly from the backend and show current nutrition status, risk level, and analysis history.
            </p>
          </div>
          <Link href="/register" className="w-fit rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Add child
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30 md:p-6">
          <ChildList />
        </div>
      </section>

      <section id="founders" className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 md:p-8">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Founder Background</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Key strengths across health, AI, and engineering</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              The team combines public health, data science, and software architecture to support clinical workflows and operational scale.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {founders.map((founder) => (
              <div key={founder.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-lg font-semibold text-white">{founder.name}</p>
                <p className="mt-1 text-sm text-cyan-200">{founder.role}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{founder.strengths}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:pb-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Workflow</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>1. Register a child and capture the intake.</p>
              <p>2. Save the record to the database.</p>
              <p>3. Run analysis and generate a report.</p>
              <p>4. Review the live record and guidance on the dashboard.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">WHO Growth Chart</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>• The app calculates growth-based z-scores from child age, sex, weight, height, BMI, and MUAC.</p>
              <p>• Red, yellow, and green traffic lights show the nutritional status at a glance.</p>
              <p>• Reports combine anthropometrics with clinical signs for a more complete assessment.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70 py-8 text-center text-sm text-slate-400 backdrop-blur-xl">
        © 2026 AI-PNAS — AI-Powered Pediatric Nutrition System
      </footer>
    </main>
  );
}
