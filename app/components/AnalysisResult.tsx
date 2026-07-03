'use client';

import { NutritionAnalysisResult } from '@/lib/types';

interface AnalysisResultProps {
  result: NutritionAnalysisResult;
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100 border-red-500 text-red-900';
    case 'Medium':
      return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    default:
      return 'bg-green-100 border-green-500 text-green-900';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'SAM':
      return 'text-red-700 font-bold';
    case 'MAM':
      return 'text-orange-700 font-semibold';
    case 'Underweight':
      return 'text-orange-600 font-semibold';
    case 'Overweight':
      return 'text-yellow-700';
    case 'Obesity':
      return 'text-red-600 font-semibold';
    default:
      return 'text-green-700';
  }
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold">{result.name}</h2>
        <p className="text-blue-100">Nutritional Assessment Report</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Child Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-gray-600 font-semibold">Age</p>
            <p className="text-lg">{result.age} months</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Sex</p>
            <p className="text-lg">{result.sex === 'M' ? 'Male' : 'Female'}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Weight</p>
            <p className="text-lg">{result.weight} kg</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Height</p>
            <p className="text-lg">{result.height} cm</p>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4">Anthropometric Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">BMI:</span>
                <span className="font-semibold text-lg">{result.bmi}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">MUAC:</span>
                <span className="font-semibold text-lg">{result.muac} cm</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4">Assessment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Nutrition Status:</span>
                <span className={`font-bold text-lg ${getStatusColor(result.nutritionStatus)}`}>
                  {result.nutritionStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Risk Level:</span>
                <span className="font-bold">{result.riskLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alert */}
        <div
          className={`border-2 rounded-lg p-4 mb-6 ${getRiskColor(result.riskLevel)}`}
        >
          <h3 className="font-bold mb-2">Risk Assessment</h3>
          <p>{result.classification}</p>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Medical Recommendation</h3>
            <p className="text-blue-800">{result.recommendation}</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-900 mb-2">Referral Suggestion</h3>
            <p className="text-purple-800">{result.referralSuggestion}</p>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-gray-500 text-xs mt-6 pt-4 border-t">
          Report generated: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
