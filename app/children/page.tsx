'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ChildRecord {
  id: string;
  name: string;
  age: number;
  sex: string;
  nutritionStatus: string | null;
  riskLevel: string | null;
  createdAt: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const response = await fetch('/api/children', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && data.success) {
          setChildren(data.children || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, []);

  const filteredChildren = children.filter((child) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [child.name, child.sex, child.nutritionStatus || '', child.riskLevel || '']
      .join(' ')
      .toLowerCase()
      .includes(term);
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-700">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          Loading children...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Children</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Child records</h1>
            </div>
            <Link href="/register" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600">
              Register child
            </Link>
          </div>

          <div className="mt-6">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search child, risk, or status"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500"
            />
          </div>

          {filteredChildren.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium text-slate-700">No matching children.</p>
              <p className="mt-2 text-sm text-slate-500">Try another search or register a new child.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Child</th>
                      <th className="px-4 py-3 font-semibold">Age</th>
                      <th className="px-4 py-3 font-semibold">Sex</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Risk</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChildren.map((child) => (
                      <tr key={child.id} className="border-t border-slate-200 bg-white">
                        <td className="px-4 py-4 font-medium text-slate-900">{child.name}</td>
                        <td className="px-4 py-4 text-slate-600">{child.age} months</td>
                        <td className="px-4 py-4 text-slate-600">{child.sex === 'M' ? 'Male' : 'Female'}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {child.nutritionStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {child.riskLevel || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/child/${child.id}`} className="font-semibold text-teal-700 hover:text-teal-600">
                            View
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
      </div>
    </main>
  );
}
