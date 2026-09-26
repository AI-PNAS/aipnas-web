'use client';

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

export default function FamilyDashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('/api/children');
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load');
        setChildren(data.children);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load children');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const latest = children[0];
  const followUpCount = useMemo(() => children.filter((child) => child.riskLevel !== 'Low').length, [children]);

  return (
    <AppShell
      title="Good morning"
      subtitle="Family dashboard"
      navItems={[
        { href: '/family', label: 'Dashboard' },
        { href: '/register', label: 'Start assessment' },
        { href: '/login', label: 'Account' },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="My children" value={children.length} />
        <StatCard label="Latest assessment" value={latest ? new Date(latest.updatedAt).toLocaleDateString() : 'No records'} />
        <StatCard label="Growth trend" value={children.length > 1 ? 'Tracking' : 'Getting started'} />
        <StatCard label="Follow-up status" value={followUpCount > 0 ? `${followUpCount} need review` : 'Routine monitoring'} />
      </section>

      <section className="mt-6 space-y-4">
        {loading && <StatePanel title="Loading child information..." description="Please wait while we load your child profiles." tone="info" />}
        {error && <StatePanel title="Unable to load child information" description={`${error}. Please try again.`} tone="error" />}
        {!loading && !error && children.length === 0 && (
          <StatePanel title="No children added yet" description="Add a child profile to begin growth monitoring and screening." tone="empty" />
        )}
        {!loading && !error && children.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <article key={child.id} className="app-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{child.name}</h2>
                    <p className="text-sm text-slate-600">
                      {child.age} months • {child.sex === 'M' ? 'Male' : 'Female'}
                    </p>
                  </div>
                  <StatusBadge tone={child.riskLevel === 'High' ? 'danger' : child.riskLevel === 'Medium' ? 'warning' : 'success'}>
                    {child.riskLevel ?? 'Pending'}
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm text-slate-600">Latest growth status: {child.nutritionStatus ?? 'No completed screening yet'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
