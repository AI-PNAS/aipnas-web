'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import RegistrationForm from '@/app/components/RegistrationForm';
import AnalysisResult from '@/app/components/AnalysisResult';
import { RegisterChildInput } from '@/lib/validation';
import { NutritionAnalysisResult } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NutritionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RegisterChildInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Failed to register child'
        );
      }

      setResult(responseData.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="register" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!result ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">AI-assisted assessment workflow</h1>
              <p className="text-slate-600">
                Use the structured workflow for child identification, measurements, AI-assisted estimation, verification, WHO growth analysis, and clinical review.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />

            <div className="mt-8 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <h3 className="font-bold text-cyan-900 mb-2">Safety note</h3>
              <ul className="text-cyan-900 text-sm space-y-1">
                <li>• AI PNAS provides screening support and does not replace professional clinical assessment.</li>
                <li>• AI confidence and measurement provenance are shown to support review decisions.</li>
                <li>
                  • <strong>Manual verification is required</strong> when confidence is below threshold.
                </li>
                <li>• Results are persisted for longitudinal follow-up and report generation.</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <button
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
              >
                ← Back to Dashboard
              </button>
            </div>

            <AnalysisResult result={result} />

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setResult(null);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Register Another Child
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
