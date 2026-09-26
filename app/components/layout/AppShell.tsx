'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandMark from '@/app/components/branding/BrandMark';

type NavItem = { href: string; label: string };

interface AppShellProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ title, subtitle, navItems, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <BrandMark withLink />
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>
            {actions}
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</div>
    </main>
  );
}
