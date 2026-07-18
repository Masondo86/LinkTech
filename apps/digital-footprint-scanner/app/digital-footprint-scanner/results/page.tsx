
// app/digital-footprint-scanner/result/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DigitalFootprintResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No payment session found.');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await fetch('/api/digital-footprint/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult(data);
        } else {
          setError(data.error || 'Failed to fetch scan results.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [sessionId]);

  if (loading) return <div className="p-8 text-center">Analyzing your digital footprint...</div>;
  if (error) return <div className="p-8 text-center text-red-600">❌ {error}</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Your Digital Footprint Report</h1>

      {/* Unified Risk Score */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold mb-4">Unified Risk Score</h2>
        <div className="flex items-center gap-6">
          <div className="text-6xl font-extrabold text-indigo-600">{result.finalScore}</div>
          <div>
            <span className={`px-4 py-2 rounded-full text-white font-semibold ${
              result.riskLevel === 'Critical' ? 'bg-red-600' :
              result.riskLevel === 'High' ? 'bg-orange-500' :
              result.riskLevel === 'Medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              {result.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* External Scan Results */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold mb-4">🔍 External Exposure</h2>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span>Breaches found</span>
            <span className="font-semibold">{result.breaches?.length || 0}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span>Email valid</span>
            <span className="font-semibold">{result.emailValid ? '✅' : '❌'}</span>
          </div>
          <div className="flex justify-between">
            <span>Phone reputation</span>
            <span className="font-semibold">{result.phoneRisk !== null ? `${result.phoneRisk}%` : 'N/A'}</span>
          </div>
          {result.breaches?.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-700">Breaches detected:</p>
              <ul className="list-disc pl-5 mt-2 text-red-600 text-sm">
                {result.breaches.slice(0, 5).map((b: string) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold mb-4">🌐 Trust Signals</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded-lg">
            <span className="text-slate-500">Public profiles found</span>
            <div className="text-xl font-semibold">{result.trustSignals?.presenceCount || 0}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <span className="text-slate-500">Negative news mentions</span>
            <div className="text-xl font-semibold text-red-600">{result.trustSignals?.negativeNews || 0}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg col-span-2">
            <span className="text-slate-500">Negative search results</span>
            <div className="text-xl font-semibold text-orange-600">{result.trustSignals?.negativeSearch || 0}</div>
          </div>
        </div>
      </div>

      {/* Device Security (if full scan) */}
      {result.deviceScore !== undefined && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
          <h2 className="text-2xl font-bold mb-4">💻 Device Security</h2>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-4xl font-extrabold text-purple-600">{result.deviceScore}</div>
            <div className="text-lg">
              {result.deviceScore >= 70 ? '⚠️ High risk' : result.deviceScore >= 40 ? '⚠️ Medium risk' : '✅ Low risk'}
            </div>
          </div>
          {result.deviceIssues?.map((issue: string, idx: number) => (
            <div key={idx} className="text-sm text-slate-600 mb-1">• {issue}</div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-800 mb-3">📋 Recommended Actions</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          {result.recommendations?.map((rec: string, idx: number) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="text-indigo-600 hover:underline">← Back to Home</Link>
        <Link href="/scan" className="text-indigo-600 hover:underline">Check more scams</Link>
      </div>
    </main>
  );
}
