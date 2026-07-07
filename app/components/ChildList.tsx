'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Child {
  id: string;
  name: string;
  age: number;
  sex: string;
  nutritionStatus: string | null;
  riskLevel: string | null;
  weight: number;
  height: number;
  muac: number;
}

function getRiskBgColor(riskLevel: string | null): string {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100';
    case 'Medium':
      return 'bg-yellow-100';
    case 'Low':
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
}

function getRiskTextColor(riskLevel: string | null): string {
  switch (riskLevel) {
    case 'High':
      return 'text-red-700 font-bold';
    case 'Medium':
      return 'text-yellow-700 font-semibold';
    case 'Low':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
}

interface ChildListProps {
  filter?: string;
}

export default function ChildList({ filter }: ChildListProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    sam: 0,
    mam: 0,
    normal: 0,
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const url = filter ? `/api/children?riskLevel=${filter}` : '/api/children';
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setChildren(data.children);

          // Calculate stats
          const childrenList = data.children;
          setStats({
            total: childrenList.length,
            high: childrenList.filter((c: Child) => c.riskLevel === 'High').length,
            medium: childrenList.filter((c: Child) => c.riskLevel === 'Medium').length,
            low: childrenList.filter((c: Child) => c.riskLevel === 'Low').length,
            sam: childrenList.filter((c: Child) => c.nutritionStatus === 'SAM').length,
            mam: childrenList.filter((c: Child) => c.nutritionStatus === 'MAM').length,
            normal: childrenList.filter((c: Child) => c.nutritionStatus === 'Normal').length,
          });
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [filter]);

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-8 text-center text-slate-300">
        Loading live child records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-sm text-slate-400">Total Children</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-sm text-red-100">High Risk</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.high}</p>
        </div>
        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-sm text-yellow-100">SAM Cases</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.sam}</p>
        </div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-sm text-emerald-100">Normal Status</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.normal}</p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-10 text-center">
          <p className="text-lg text-slate-200">No children registered yet</p>
          <p className="mt-2 text-sm text-slate-400">Create the first child record to start the nutrition workflow.</p>
          <Link href="/register" className="mt-5 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Register the first child
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-slate-950/30">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Risk</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.id} className="border-b border-white/5 text-slate-300 transition hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{child.name}</p>
                      <p className="text-xs text-slate-400">{child.sex === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{child.age}m</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-slate-200">
                      {child.nutritionStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${getRiskBgColor(child.riskLevel)} ${getRiskTextColor(child.riskLevel)}`}
                    >
                      {child.riskLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/child/${child.id}`}
                      className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
