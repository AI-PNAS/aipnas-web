'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/app/components/layout/AppShell';
import StatePanel from '@/app/components/ui/StatePanel';
import StatusBadge from '@/app/components/ui/StatusBadge';

interface AnalysisLog {
  id: string;
  analysis: string;
  createdAt: string;
}

interface ChildData {
  id: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  muac: number;
  headCircumference: number | null;
  chestCircumference: number | null;
  nutritionStatus: string | null;
  riskLevel: string | null;
  recommendation: string | null;
  referralSuggestion: string | null;
  weightForAgeZ: number | null;
  heightForAgeZ: number | null;
  weightForHeightZ: number | null;
  bmiForAgeZ: number | null;
  muacZ: number | null;
}

interface ChildDetailsPageProps {
  params: Promise<{ id: string }>;
}

function MiniLineChart({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <p className="text-sm text-slate-500">No longitudinal data available yet.</p>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const safeRange = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / safeRange) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-24 w-full" aria-label="Growth trend chart">
      <polyline fill="none" stroke="#0f5f78" strokeWidth="3" points={points} />
    </svg>
  );
}

export default function ChildDetailsPage({ params }: ChildDetailsPageProps) {
  const [child, setChild] = useState<ChildData | null>(null);
  const [history, setHistory] = useState<AnalysisLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => setChildId(resolvedParams.id));
  }, [params]);

  useEffect(() => {
    if (!childId) return;
    const run = async () => {
      try {
        const response = await fetch(`/api/child/${childId}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to fetch child');
        setChild(data.child);
        setHistory(data.history || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load child information');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [childId]);

  const trendValues = useMemo(() => {
    return history
      .map((item) => {
        try {
          const parsed = JSON.parse(item.analysis) as { weight?: number };
          return parsed.weight;
        } catch {
          return undefined;
        }
      })
      .filter((value): value is number => typeof value === 'number');
  }, [history]);

  return (
    <AppShell
      title={child ? child.name : 'Child profile'}
      subtitle={child ? `${child.age} months • ${child.sex === 'M' ? 'Male' : 'Female'}` : 'Loading child profile'}
      navItems={[
        { href: '/clinical', label: 'Dashboard' },
        { href: '/register', label: 'Assessments' },
      ]}
      actions={<Link href="/clinical" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">Back</Link>}
    >
      {loading && <StatePanel title="Loading child information..." description="Please wait while profile and assessment history are loaded." />}
      {error && <StatePanel title="Unable to load this child's information" description={`${error}. Please try again.`} tone="error" />}
      {!loading && !error && !child && <StatePanel title="Child not found" description="The requested profile is not available." tone="empty" />}
      {!loading && !error && child && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            <article className="app-card p-4">
              <p className="text-sm text-slate-500">Weight</p>
              <p className="mt-1 text-xl font-semibold">{child.weight} kg</p>
            </article>
            <article className="app-card p-4">
              <p className="text-sm text-slate-500">Height / Length</p>
              <p className="mt-1 text-xl font-semibold">{child.height} cm</p>
            </article>
            <article className="app-card p-4">
              <p className="text-sm text-slate-500">MUAC</p>
              <p className="mt-1 text-xl font-semibold">{child.muac} cm</p>
            </article>
            <article className="app-card p-4">
              <p className="text-sm text-slate-500">Risk</p>
              <div className="mt-1">
                <StatusBadge tone={child.riskLevel === 'High' ? 'danger' : child.riskLevel === 'Medium' ? 'warning' : 'success'}>
                  {child.riskLevel ?? 'Pending'}
                </StatusBadge>
              </div>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="app-card p-5">
              <h2 className="text-lg font-semibold">Growth overview</h2>
              <p className="mt-2 text-sm text-slate-600">Nutrition screening status: {child.nutritionStatus ?? 'Not available yet'}</p>
              <p className="mt-2 text-sm text-slate-600">Head circumference: {child.headCircumference ?? 'Not recorded'} cm</p>
              <p className="mt-2 text-sm text-slate-600">Chest circumference: {child.chestCircumference ?? 'Not recorded'} cm</p>
            </article>
            <article className="app-card p-5">
              <h2 className="text-lg font-semibold">Growth trend</h2>
              <MiniLineChart values={trendValues} />
              <p className="mt-2 text-xs text-slate-500">Reference curve overlay: pending backend integration.</p>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="app-card p-5">
              <h2 className="text-lg font-semibold">WHO growth indicators</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Weight-for-age: {child.weightForAgeZ ?? 'N/A'} Z</li>
                <li>Height-for-age: {child.heightForAgeZ ?? 'N/A'} Z</li>
                <li>Weight-for-height: {child.weightForHeightZ ?? 'N/A'} Z</li>
                <li>BMI-for-age: {child.bmiForAgeZ ?? 'N/A'} Z</li>
                <li>MUAC: {child.muacZ ?? 'N/A'} Z</li>
              </ul>
            </article>
            <article className="app-card p-5">
              <h2 className="text-lg font-semibold">Risk and follow-up</h2>
              <p className="mt-2 text-sm text-slate-600">{child.recommendation ?? 'No recommendation available yet.'}</p>
              <p className="mt-2 text-sm text-slate-600">{child.referralSuggestion ?? 'No referral note available yet.'}</p>
              <p className="mt-3 text-xs text-slate-500">
                Screening outputs are decision-support information and require professional clinical review.
              </p>
            </article>
          </section>

          <section className="app-card p-5">
            <h2 className="text-lg font-semibold">Assessment history</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No assessments have been recorded yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {history.map((log) => (
                  <li key={log.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
