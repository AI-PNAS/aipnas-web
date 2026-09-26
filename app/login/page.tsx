'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AuthMode = 'login' | 'register';
type AccountType = 'family' | 'professional';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'family' as AccountType,
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

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('aipnas_user', JSON.stringify(result.user));
      setSuccess('Signed in successfully. Redirecting...');
      setTimeout(() => router.push('/clinical'), 700);
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

      // TODO: Persist accountType in backend when user-role model is available.
      localStorage.setItem('aipnas_account_type', registerForm.accountType);
      setSuccess('Account created. You can sign in now.');
      setMode('login');
      setLoginForm({ email: registerForm.email, password: '' });
      setRegisterForm({ fullName: '', email: '', password: '', confirmPassword: '', accountType: 'family' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <section className="app-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">AI PNAS access</p>
          <h1 className="mt-2 text-3xl font-semibold">Secure sign in</h1>
          <p className="mt-3 text-sm text-slate-600">
            Access family and professional workflows for pediatric nutrition screening and follow-up.
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>• Family: child profiles, trends, and follow-up guidance</p>
            <p>• Health professional: clinical dashboard, assessments, and reports</p>
          </div>
          <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800">
            Back to home
          </Link>
        </section>

        <section className="app-card p-6">
          <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-md px-4 py-2 font-semibold ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-md px-4 py-2 font-semibold ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              Create account
            </button>
          </div>

          {error && <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
          {success && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium">
                Password
                <div className="mt-2 flex rounded-lg border border-slate-300 bg-white">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full rounded-l-lg px-3 py-2.5"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-r-lg border-l border-slate-300 px-3 text-sm font-medium text-slate-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-teal-700">
                  Forgot password
                </button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <label className="block text-sm font-medium">
                Full name
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm font-medium">
                Account type
                <select
                  value={registerForm.accountType}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, accountType: event.target.value as AccountType }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                >
                  <option value="family">Family</option>
                  <option value="professional">Health Professional</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                />
              </label>
              <label className="block text-sm font-medium">
                Confirm password
                <input
                  type="password"
                  required
                  minLength={8}
                  value={registerForm.confirmPassword}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                />
              </label>
              <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white">
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
