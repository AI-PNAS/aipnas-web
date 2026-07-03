'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Child {
  id: string;
  name: string;
  age: number;
  sex: string;
  nutritionStatus: string | null;
  riskLevel: string | null;
  weight: number;
  height: number;
  muac: number;
}

function getRiskBgColor(riskLevel: string | null): string {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100';
    case 'Medium':
      return 'bg-yellow-100';
    case 'Low':
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
}

function getRiskTextColor(riskLevel: string | null): string {
  switch (riskLevel) {
    case 'High':
      return 'text-red-700 font-bold';
    case 'Medium':
      return 'text-yellow-700 font-semibold';
    case 'Low':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
}

interface ChildListProps {
  filter?: string;
}

export default function ChildList({ filter }: ChildListProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    sam: 0,
    mam: 0,
    normal: 0,
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const url = filter ? `/api/children?riskLevel=${filter}` : '/api/children';
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setChildren(data.children);

          // Calculate stats
          const childrenList = data.children;
          setStats({
            total: childrenList.length,
            high: childrenList.filter((c: Child) => c.riskLevel === 'High').length,
            medium: childrenList.filter((c: Child) => c.riskLevel === 'Medium').length,
            low: childrenList.filter((c: Child) => c.riskLevel === 'Low').length,
            sam: childrenList.filter((c: Child) => c.nutritionStatus === 'SAM').length,
            mam: childrenList.filter((c: Child) => c.nutritionStatus === 'MAM').length,
            normal: childrenList.filter((c: Child) => c.nutritionStatus === 'Normal').length,
          });
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [filter]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Total Children</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">High Risk</p>
          <p className="text-3xl font-bold">{stats.high}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">SAM Cases</p>
          <p className="text-3xl font-bold">{stats.sam}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
          <p className="text-sm opacity-90">Normal Status</p>
          <p className="text-3xl font-bold">{stats.normal}</p>
        </div>
      </div>

      {/* Children Table */}
      {children.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No children registered yet</p>
          <Link href="/register" className="text-blue-600 hover:underline mt-2 inline-block">
            Register the first child
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Risk</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{child.name}</p>
                      <p className="text-xs text-gray-500">{child.sex === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{child.age}m</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">
                      {child.nutritionStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBgColor(
                        child.riskLevel
                      )} ${getRiskTextColor(child.riskLevel)}`}
                    >
                      {child.riskLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/child/${child.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
