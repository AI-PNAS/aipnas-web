'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign in');
      }

      localStorage.setItem('aipnas_user', JSON.stringify(result.user));
      setSuccess('Signed in successfully. Redirecting...');
      setTimeout(() => router.push('/'), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerForm.fullName,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account');
      }

      setSuccess('Account created. You can sign in now.');
      setMode('login');
      setLoginForm({ email: registerForm.email, password: '' });
      setRegisterForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-8 md:px-10">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:grid-cols-[1fr_1fr] md:p-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mx-auto max-w-[360px]">
              <Image
                src="/logo-aipnas.svg"
                alt="AI-PNAS logo"
                width={360}
                height={360}
                className="h-auto w-full"
                priority
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-white">Welcome to AI-PNAS</h1>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Clean and secure access for parents, health professionals, and organizations.
            </p>
            <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
              New user? Create account. Existing user? Sign in.
            </div>
            <Link href="/" className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">
              Back to Home
            </Link>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 font-semibold transition ${mode === 'login' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full px-4 py-2 font-semibold transition ${mode === 'register' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                Create Account
              </button>
            </div>

            {error && <p className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            {success && <p className="mb-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Password
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="Enter your password"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                  Full Name
                  <input
                    type="text"
                    required
                    value={registerForm.fullName}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="Your full name"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Password
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="At least 8 characters"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Confirm Password
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={registerForm.confirmPassword}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="Repeat password"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
