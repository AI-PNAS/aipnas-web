'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
            <span className="logo-tricolor flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1 shadow-lg shadow-black/20">
              <Image src="/logo-aipnas.svg" alt="AI-PNAS logo" width={52} height={52} priority />
            </span>
            <span className="text-sm font-semibold tracking-[0.2em] text-teal-100">AI PNAS</span>
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
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session', { cache: 'no-store' });
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) return;

        setUser(sessionData.user);

        const childrenResponse = await fetch('/api/children', { cache: 'no-store' });
        const childrenData = await childrenResponse.json();

        if (childrenResponse.ok && childrenData.success) {
          setChildren(childrenData.children || []);
        }
      } catch {
        // Swallow fetch/network issues and keep the UI in a valid state.
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

  const summaryCards = isProfessional
    ? [
        { label: 'Children', value: children.length },
        { label: 'Recent Assessments', value: children.length > 0 ? String(children.length) : '0' },
        { label: 'Pending Reviews', value: '2' },
        { label: 'Follow-up', value: '3' },
      ]
    : [
        { label: 'My Children', value: children.length },
        { label: 'Latest Assessment', value: children[0]?.nutritionStatus || 'Pending' },
        { label: 'Growth Status', value: children[0]?.riskLevel || 'N/A' },
        { label: 'Follow-up', value: 'Routine' },
      ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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

            {children.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-lg font-medium text-slate-700">No children registered yet.</p>
                <p className="mt-2 text-sm text-slate-500">Create the first child record to start the assessment workflow.</p>
                <Link href="/register" className="mt-5 inline-flex rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Register Child
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {children.map((child) => (
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
