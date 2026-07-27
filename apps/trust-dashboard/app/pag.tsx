'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    router.push(`/profile?email=${encodeURIComponent(email)}`);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            🔒 Privacy First • South Africa
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Your Digital Trust Profile
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Enter your email to see your unified risk score, scam exposure, and digital footprint.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Loading...' : 'View Profile'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>✅ No passwords stored</span>
            <span>✅ POPIA compliant</span>
            <span>✅ Results in seconds</span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-slate-200">
            <div>
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-sm text-slate-500">Scans Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-sm text-slate-500">High Risk</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-sm text-slate-500">Total Scans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center py-8">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}