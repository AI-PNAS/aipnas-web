'use client';

import { useState } from 'react';
import { RegisterChildInput } from '@/lib/validation';

interface RegistrationFormProps {
  onSubmit: (data: RegisterChildInput) => void;
  isLoading: boolean;
}

export default function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegisterChildInput>({
    name: '',
    age: 0,
    sex: 'M',
    weight: 0,
    height: 0,
    muac: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New Child</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Child Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter child's name"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Age (months) *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            max="180"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Sex *</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Weight (kg) *
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Height (cm) *
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        {/* MUAC */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            MUAC - Mid-Upper Arm Circumference (cm) *
          </label>
          <input
            type="number"
            name="muac"
            value={formData.muac}
            onChange={handleChange}
            required
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        {/* Head Circumference (Optional) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-gray-600">
            Head Circumference (cm) - Optional
          </label>
          <input
            type="number"
            name="headCircumference"
            value={formData.headCircumference || ''}
            onChange={handleChange}
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>

        {/* Chest Circumference (Optional) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-gray-600">
            Chest Circumference (cm) - Optional
          </label>
          <input
            type="number"
            name="chestCircumference"
            value={formData.chestCircumference || ''}
            onChange={handleChange}
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
        >
          {isLoading ? 'Processing...' : 'Register & Analyze'}
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-4">
        * Required fields. All values will be analyzed using WHO anthropometric standards.
      </p>
    </form>
  );
}
