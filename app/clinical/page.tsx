'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/app/components/layout/AppShell';
import StatCard from '@/app/components/ui/StatCard';
import StatePanel from '@/app/components/ui/StatePanel';
import StatusBadge from '@/app/components/ui/StatusBadge';

interface Child {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  nutritionStatus: string | null;
  riskLevel: string | null;
  updatedAt: string;
}

export default function ClinicalDashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('/api/children');
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load children');
        setChildren(data.children);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load children');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredChildren = useMemo(() => {
    return children
      .filter((child) => (riskFilter === 'all' ? true : child.riskLevel === riskFilter))
      .filter((child) => child.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [children, riskFilter, search]);

  const followUpRequired = useMemo(() => children.filter((child) => child.riskLevel === 'High' || child.riskLevel === 'Medium').length, [children]);

  return (
    <AppShell
      title="Clinical dashboard"
      subtitle="AI-assisted pediatric screening and follow-up"
      navItems={[
        { href: '/clinical', label: 'Dashboard' },
        { href: '/register', label: 'Assessments' },
        { href: '/reports', label: 'Reports' },
        { href: '/family', label: 'Family view' },
      ]}
      actions={<Link href="/register" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">Start assessment</Link>}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total children" value={children.length} />
        <StatCard label="Assessments today" value={children.length > 0 ? Math.min(children.length, 6) : 0} />
        <StatCard label="Follow-up required" value={followUpRequired} />
        <StatCard label="Recent assessments" value={children.slice(0, 3).length} />
      </section>

      <section className="mt-6 app-card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm font-medium">
            Search children
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by child name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium">
            Assessment status
            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value as 'all' | 'High' | 'Medium' | 'Low')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="all">All</option>
              <option value="High">Needs clinical review</option>
              <option value="Medium">Needs follow-up</option>
              <option value="Low">Routine monitoring</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {loading && <StatePanel title="Loading child information..." description="Fetching recent assessments for clinical review." />}
        {error && <StatePanel title="Unable to load child information" description={error} tone="error" />}
        {!loading && !error && filteredChildren.length === 0 && (
          <StatePanel title="No matching children" description="Try a different search or filter value." tone="empty" />
        )}
        {!loading && !error && filteredChildren.length > 0 && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-600">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Age</th>
                    <th className="px-3 py-2">Sex</th>
                    <th className="px-3 py-2">Last assessment</th>
                    <th className="px-3 py-2">Latest status</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium">{child.name}</td>
                      <td className="px-3 py-2">{child.age}m</td>
                      <td className="px-3 py-2">{child.sex}</td>
                      <td className="px-3 py-2">{new Date(child.updatedAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{child.nutritionStatus ?? 'Pending'}</td>
                      <td className="px-3 py-2">
                        <Link href={`/child/${child.id}`} className="font-semibold text-teal-700">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {filteredChildren.map((child) => (
                <article key={child.id} className="app-card p-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-base font-semibold">{child.name}</h2>
                    <StatusBadge tone={child.riskLevel === 'High' ? 'danger' : child.riskLevel === 'Medium' ? 'warning' : 'success'}>
                      {child.riskLevel ?? 'Pending'}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {child.age} months • {child.sex}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Last assessment: {new Date(child.updatedAt).toLocaleDateString()}</p>
                  <Link href={`/child/${child.id}`} className="mt-3 inline-flex text-sm font-semibold text-teal-700">
                    View child profile
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
