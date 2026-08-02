'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
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
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Privacy First • South Africa
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Your Unified<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Digital Trust Profile
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            See your complete risk picture – scam exposure, digital footprint, and trust signals – all in one clear dashboard.
          </p>

          {/* Email input form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'View My Profile'}
            </button>
          </form>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-slate-500">
            <span>✅ No passwords stored</span>
            <span>✅ POPIA compliant</span>
            <span>✅ Results in seconds</span>
            <span>✅ Free beta</span>
          </div>
        </div>
      </section>

      {/* ===== THREE PILLARS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            What’s in Your Trust Profile?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-indigo-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Scam Exposure</h3>
              <p className="text-slate-600">
                Your scan history, risk levels, and recent threats detected by our Scam Verification Engine.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-purple-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Footprint</h3>
              <p className="text-slate-600">
                Email breaches, phone reputation, device security – know where your data is exposed.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-pink-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Trust Signals</h3>
              <p className="text-slate-600">
                Social presence, news mentions, and reputation indicators that build (or break) digital trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1</div>
              <h4 className="font-bold text-slate-900">Enter your email</h4>
              <p className="text-slate-600 text-sm">No passwords, no sign‑up – just your email.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
              <h4 className="font-bold text-slate-900">We analyse your risk</h4>
              <p className="text-slate-600 text-sm">We check breaches, phone reputation, and scam history.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-pink-600 mb-2">3</div>
              <h4 className="font-bold text-slate-900">Get your profile</h4>
              <p className="text-slate-600 text-sm">View your unified risk score and actionable recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to see your digital trust score?</h2>
          <p className="text-lg text-slate-600 mb-8">It takes 10 seconds – and it’s free during beta.</p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105"
          >
            Check My Exposure
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; 2026 The Link Digital Security. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="text-indigo-600 hover:underline">Back to Home</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}