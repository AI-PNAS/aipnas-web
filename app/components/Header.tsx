'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const navLinks = [
    { href: '/', label: language === 'en' ? 'Home' : 'መነሻ' },
    { href: '/about', label: language === 'en' ? 'About' : 'ስለ እኛ' },
    { href: '/services', label: language === 'en' ? 'Services' : 'አገልግሎቶች' },
    { href: '/dashboard', label: language === 'en' ? 'Dashboard' : 'ዳሽቦርድ' },
  ];

  const pageLinkStyles = (page: string) =>
    `transition ${currentPage === page ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`;

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo/ai-pnas-logo.png" alt="AI PNAS logo" width={1254} height={1254} priority className="h-[52px] w-auto md:h-[72px]" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={pageLinkStyles(item.href.replace('/', '') || 'home')}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('am')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${language === 'am' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              አማ
            </button>
          </div>
          <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            {language === 'en' ? 'Login' : 'ግባ'}
          </Link>
          <Link href="/login?mode=register" className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600">
            {language === 'en' ? 'Create Account' : 'መለያ ፍጠር'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? '×' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-700">
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700">
                {language === 'en' ? 'Login' : 'ግባ'}
              </Link>
              <Link href="/login?mode=register" onClick={() => setIsOpen(false)} className="flex-1 rounded-full bg-teal-700 px-4 py-2 text-center text-sm font-semibold text-white">
                {language === 'en' ? 'Create Account' : 'መለያ ፍጠር'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
