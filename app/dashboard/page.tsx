'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';

interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: 'family' | 'health_professional';
}

interface ChildRecord {
  id: string;
  name: string;
  age: number;
  sex: string;
  nutritionStatus: string | null;
  riskLevel: string | null;
  createdAt: string;
}

const childStories = [
  { src: '/public/images/aipnas-logo.png/a.png', alt: 'Child nutrition assessment with caregiver' },
  { src: '/public/images/aipnas-logo.png/ai.png', alt: 'Child receiving care and nutrition support' },
  { src: '/public/images/aipnas-logo.png/b.png', alt: 'Community child nutrition monitoring' },
];

function PublicDashboardPreview() {
  const features = [
    ['Growth trends', 'Track measurements over time'],
    ['Risk signals', 'Surface priority follow-up needs'],
    ['Care history', 'Keep every assessment connected'],
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#071a23] text-white">
      <div className="dashboard-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo/ai-pnas-logo.png" alt="AI PNAS logo" width={1254} height={1254} priority className="h-[52px] w-auto md:h-[72px]" />
          </Link>
          <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Sign in</Link>
        </header>

        <section className="mt-16 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="dashboard-reveal">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">The care dashboard</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">See the whole child nutrition journey.</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">One connected workspace for families and health professionals to assess, monitor, and follow up.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login?mode=register" className="rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-[#05242c] transition hover:bg-teal-300">Create account</Link>
              <Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Explore AI PNAS</Link>
            </div>
          </div>

          <div className="dashboard-panel rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-7">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Overview</p><h2 className="mt-2 text-2xl font-semibold">Care dashboard</h2></div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />Live</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[['24', 'Children'], ['18', 'Assessed'], ['04', 'Review'], ['92%', 'Follow-up']].map(([value, label], index) => <div key={label} className="dashboard-stat rounded-2xl border border-white/10 bg-black/10 p-4" style={{ animationDelay: `${index * 120}ms` }}><p className="text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-5">
              <div className="flex items-center justify-between"><p className="font-semibold">Growth monitoring</p><span className="text-xs text-teal-200">Last 6 months</span></div>
              <div className="mt-6 flex h-32 items-end gap-2 sm:gap-4">{[32, 48, 42, 65, 58, 82, 74, 94].map((height, index) => <span key={index} className="dashboard-bar w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-cyan-200" style={{ height: `${height}%`, animationDelay: `${index * 100}ms` }} />)}</div>
              <div className="mt-3 flex justify-between text-xs text-slate-500"><span>Jan</span><span>Jun</span></div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">{features.map(([title, description], index) => <div key={title} className="dashboard-feature rounded-2xl border border-white/10 bg-white/[0.05] p-4" style={{ animationDelay: `${index * 180 + 400}ms` }}><p className="text-sm font-semibold text-white">{title}</p><p className="mt-2 text-xs leading-5 text-slate-400">{description}</p></div>)}</div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">Visible before sign in</p>
          <h2 className="mt-3 text-2xl font-semibold">Every difficult case deserves attention.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {childStories.map((story, index) => (
              <div key={story.src} className="child-story-card relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ animationDelay: `${index * 180 + 600}ms` }}>
                <Image src={story.src} alt={story.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session', { cache: 'no-store' });
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) return;

        setUser(sessionData.user);

        const childrenResponse = await fetch('/api/children', { cache: 'no-store' });
        const childrenData = await childrenResponse.json();

        if (!childrenResponse.ok || !childrenData.success) {
          throw new Error(childrenData.message || 'We could not load child records.');
        }
        setChildren(childrenData.children || []);
      } catch {
        setError('We could not load child records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-700">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (!user) {
    return <PublicDashboardPreview />;
  }

  const isProfessional = user.role === 'health_professional';

  const filteredChildren = children.filter((child) => {
    const matchesQuery = `${child.name} ${child.id} ${child.nutritionStatus || ''}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesRisk = riskFilter === 'All' || child.riskLevel === riskFilter;
    return matchesQuery && matchesRisk;
  });

  const assessedCount = children.filter((child) => child.nutritionStatus).length;
  const followUpCount = children.filter((child) => child.riskLevel === 'Medium' || child.riskLevel === 'High').length;
  const pendingCount = children.length - assessedCount;
  const summaryCards = [
    { label: isProfessional ? 'Children' : 'My children', value: children.length },
    { label: 'Assessments', value: assessedCount },
    { label: 'Follow-up', value: followUpCount },
    { label: 'Pending review', value: pendingCount },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="dashboard" />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:px-10">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                {isProfessional ? 'Health professional portal' : 'Family portal'}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {user.fullName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-700">
                {user.fullName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <button type="button" onClick={handleSignOut} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Sign out
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</p>
            </div>
          ))}
        </section>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => window.location.reload()} className="font-semibold underline underline-offset-4">Try again</button>
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Children</p>
                <h2 className="mt-2 text-2xl font-semibold">{isProfessional ? 'Clinic roster' : 'My children'}</h2>
              </div>
              <Link href="/register" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600">
                {isProfessional ? 'Register child' : 'Add child'}
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px]">
              <label className="sr-only" htmlFor="child-search">Search child records</label>
              <input id="child-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by child name or ID" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
              <label className="sr-only" htmlFor="risk-filter">Filter by risk</label>
              <select id="risk-filter" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                <option>All</option><option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>

            {children.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-lg font-medium text-slate-700">No children registered yet.</p>
                <p className="mt-2 text-sm text-slate-500">Create the first child record to start the assessment workflow.</p>
                <Link href="/register" className="mt-5 inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Register Child
                </Link>
              </div>
            ) : filteredChildren.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">No children match the current search or risk filter.</div>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredChildren.map((child) => (
                  <div key={child.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{child.name}</p>
                      <p className="text-sm text-slate-500">{child.age} months · {child.sex === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{child.nutritionStatus || 'Pending'}</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{child.riskLevel || 'N/A'}</span>
                      <Link href={`/child/${child.id}`} className="text-sm font-semibold text-teal-700 hover:text-teal-600">
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Quick actions</p>
            <div className="mt-6 space-y-3">
              <Link href="/register" className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                {isProfessional ? 'Start new assessment' : 'Register child'}
              </Link>
              <Link href="/services" className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                View services
              </Link>
              <Link href="/about" className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                About AI PNAS
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
