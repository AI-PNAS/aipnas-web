'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

type AuthMode = 'login' | 'register';
type Role = 'family' | 'health_professional';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'family' as Role,
  });

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);

    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', nextMode);
    router.replace(`/login?${params.toString()}`);
  };

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

      setSuccess('Signed in successfully. Redirecting...');
      setTimeout(() => router.push('/dashboard'), 500);
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

    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters.');
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
          role: registerForm.role,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        const validationMessages = Array.isArray(result.errors)
          ? result.errors
              .map((entry: { message?: unknown }) => entry.message)
              .filter((message: unknown): message is string => typeof message === 'string')
              .join(' ')
          : '';

        throw new Error(validationMessages || result.message || 'Failed to create account');
      }

      setSuccess('Account created successfully. Redirecting...');
      setTimeout(() => router.push('/dashboard'), 600);
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
            <div className="mx-auto max-w-[460px]">
              <Image src="/logo/ai-pnas-logo.png" alt="AI PNAS logo" width={1254} height={1254} className="h-auto w-full max-w-[440px]" priority />
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
              <button type="button" onClick={() => switchMode('login')} className={`rounded-full px-4 py-2 font-semibold transition ${mode === 'login' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}>
                Sign In
              </button>
              <button type="button" onClick={() => switchMode('register')} className={`rounded-full px-4 py-2 font-semibold transition ${mode === 'register' ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}>
                Create Account
              </button>
            </div>

            {error && <p className="mb-4 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            {success && <p className="mb-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <input type="email" required value={loginForm.email} onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30" placeholder="you@example.com" />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Password
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-300/30">
                    <input type={showPassword ? 'text' : 'password'} required value={loginForm.password} onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))} className="w-full bg-transparent text-white outline-none placeholder:text-slate-400" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-xs font-semibold text-cyan-200 underline-offset-2 hover:underline">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm text-slate-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                    Remember me
                  </label>
                  <Link href="/" className="text-cyan-200 hover:text-cyan-100">Forgot password?</Link>
                </div>

                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-400">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <label className="block text-sm font-medium text-slate-200">
                  Full Name
                  <input type="text" required value={registerForm.fullName} onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30" placeholder="Your full name" />
                </label>

                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <input type="email" required value={registerForm.email} onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30" placeholder="you@example.com" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Password
                    <input type="password" required minLength={8} value={registerForm.password} onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30" placeholder="At least 8 characters" />
                  </label>

                  <label className="block text-sm font-medium text-slate-200">
                    Confirm Password
                    <input type="password" required minLength={8} value={registerForm.confirmPassword} onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30" placeholder="Repeat password" />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-200">
                  Role
                  <select value={registerForm.role} onChange={(event) => setRegisterForm((prev) => ({ ...prev, role: event.target.value as Role }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30">
                    <option value="family" className="bg-slate-900">Family</option>
                    <option value="health_professional" className="bg-slate-900">Health Professional</option>
                  </select>
                </label>

                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-400">
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

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#07111f]" />}>
      <LoginForm />
    </Suspense>
  );
}
