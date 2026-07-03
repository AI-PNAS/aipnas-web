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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header currentPage="register" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Register Child</h1>
              <p className="text-gray-600">
                Enter child anthropometric measurements for AI-powered nutritional assessment
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">About the Assessment</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>
                  • <strong>MUAC Classification:</strong> MUAC &lt; 11.5cm = SAM, 11.5-12.5cm = MAM
                </li>
                <li>
                  • <strong>BMI Classification:</strong> Based on weight and height measurements
                </li>
                <li>• All assessments follow WHO anthropometric standards</li>
                <li>• Results are saved for future reference and tracking</li>
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
