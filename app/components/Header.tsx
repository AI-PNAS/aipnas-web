'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  currentPage: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [language, setLanguage] = useState('en');

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI-PNAS</h1>
            <p className="text-blue-100 text-sm">
              AI Powered Pediatric Nutritional Assessment System
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2 bg-blue-700 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded ${
                  language === 'en' ? 'bg-white text-blue-600' : 'text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('am')}
                className={`px-4 py-2 rounded ${
                  language === 'am' ? 'bg-white text-blue-600' : 'text-white'
                }`}
              >
                አ
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex gap-6 border-t border-blue-500 pt-4">
          <Link
            href="/"
            className={`pb-2 border-b-2 ${
              currentPage === 'dashboard'
                ? 'border-white font-semibold'
                : 'border-transparent hover:border-blue-300'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/register"
            className={`pb-2 border-b-2 ${
              currentPage === 'register'
                ? 'border-white font-semibold'
                : 'border-transparent hover:border-blue-300'
            }`}
          >
            Register Child
          </Link>
        </nav>
      </div>
    </header>
  );
}
