'use client';

import Link from 'next/link';

interface HeaderProps {
  currentPage: 'dashboard' | 'register';
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">AI PNAS</p>
          <p className="text-sm text-slate-600">AI-assisted pediatric nutritional screening</p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/clinical" className="rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700">
            Clinical dashboard
          </Link>
          <Link href="/family" className="rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700">
            Family dashboard
          </Link>
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 font-medium ${currentPage === 'dashboard' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Home
          </Link>
          <Link
            href="/register"
            className={`rounded-lg px-3 py-2 font-medium ${currentPage === 'register' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
