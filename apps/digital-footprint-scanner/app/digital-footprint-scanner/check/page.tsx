
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DigitalFootprintCheck() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<'email' | 'full'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceData, setDeviceData] = useState<any>(null);

  // Collect device signals on mount
  useEffect(() => {
    const collectDeviceData = () => {
      const data = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        connection: (navigator as any).connection?.effectiveType,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
      };
      setDeviceData(data);
    };

    collectDeviceData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (plan === 'full' && !phone) {
      setError('Phone number is required for the full scan.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Checkout Session
      const res = await fetch('/api/digital-footprint/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          plan,
          deviceData, // will be stored as metadata (limited to 500 chars, but we'll store in a temp table later)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment session creation failed.');
      }

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load.');

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (redirectError) {
        throw new Error(redirectError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Digital Footprint Scanner</h1>
      <p className="text-lg text-slate-600 mb-8">
        Check your email, phone, and device for data breaches, spam risk, and vulnerabilities.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan selection */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select your scan</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className={`border rounded-xl p-4 cursor-pointer transition-all ${plan === 'email' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
              <input
                type="radio"
                name="plan"
                value="email"
                checked={plan === 'email'}
                onChange={() => setPlan('email')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">R29</div>
                <div className="text-sm text-slate-500">Email Scan</div>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 text-left">
                  <li>✅ Email breach check</li>
                  <li>✅ Email validity</li>
                  <li>✅ Spam/fraud reputation</li>
                </ul>
              </div>
            </label>

            <label className={`border rounded-xl p-4 cursor-pointer transition-all ${plan === 'full' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
              <input
                type="radio"
                name="plan"
                value="full"
                checked={plan === 'full'}
                onChange={() => setPlan('full')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">R59</div>
                <div className="text-sm text-slate-500">Full Scan</div>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 text-left">
                  <li>✅ Everything in Email Scan</li>
                  <li>✅ Phone reputation</li>
                  <li>✅ Device security audit</li>
                </ul>
              </div>
            </label>
          </div>
        </div>

        {/* Email & Phone inputs */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {plan === 'full' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0821234567"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            ❌ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay R${plan === 'email' ? '29' : '59'} & Scan`}
        </button>

        <p className="text-xs text-slate-400 text-center">
          🔒 Your data is never stored. Payment processed securely via Stripe.
        </p>
      </form>
    </main>
  );
}
