'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
        Your Digital Trust Profile
      </h1>
      <p className="text-center text-slate-600 mb-8">
        Enter your email to see your unified risk score, scam exposure, and digital footprint.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
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
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'View Profile'}
        </button>
      </form>
      <p className="text-xs text-slate-400 text-center mt-4">
        🔒 Your data is never stored. We only fetch aggregated risk signals.
      </p>
    </main>
  );
}