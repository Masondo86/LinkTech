// app/digital-footprint-scanner/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DigitalFootprintScannerPage() {
  const [email, setEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with your actual waitlist API endpoint
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setWaitlistSubmitted(true);
      setEmail('');
    } else {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            🔒 Privacy First • South Africa
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Know Your Digital Exposure
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Check your email, phone, and device for data breaches, spam risk, and vulnerabilities.
            Get a unified risk score and a clear action plan – before fraudsters do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
            >
              Check My Exposure
            </Link>
            <Link
              href="#learn"
              className="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>✅ No passwords stored</span>
            <span>✅ POPIA compliant</span>
            <span>✅ Results in seconds</span>
            <span>✅ Pay once, no subscription</span>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600">R3.9B</div>
            <div className="text-slate-500 text-sm">Lost to fraud (2025)</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">400%</div>
            <div className="text-slate-500 text-sm">Increase in identity theft</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">16B+</div>
            <div className="text-slate-500 text-sm">Records exposed in breaches</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600">1,000+</div>
            <div className="text-slate-500 text-sm">Data broker sites</div>
          </div>
        </div>
      </section>

      {/* What We Scan */}
      <section id="learn" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What We Check</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-3">Email Exposure</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✅ Breach detection (HaveIBeenPwned)</li>
                <li>✅ Validity & deliverability</li>
                <li>✅ Disposable address detection</li>
                <li>✅ Fraud score</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3">Phone Risk</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✅ Spam/fraud reputation</li>
                <li>✅ Inactive / disconnected status</li>
                <li>✅ Data breach presence</li>
                <li>✅ Carrier & location (optional)</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3">Device Security</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✅ Browser version & updates</li>
                <li>✅ HTTPS & TLS support</li>
                <li>✅ Security headers</li>
                <li>✅ Cookie & referrer policies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-slate-600 mb-12">One‑time scans – no subscriptions. Pay only when you check.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Email + Phone Scan */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 text-center">
              <div className="text-indigo-600 text-sm font-semibold uppercase mb-2">Most Popular</div>
              <div className="text-4xl font-bold text-slate-900 mb-2">R29</div>
              <div className="text-slate-500 mb-6">one‑time scan</div>
              <h3 className="text-xl font-bold mb-3">Email + Phone Scan</h3>
              <ul className="text-left text-sm text-slate-600 space-y-2 mb-6">
                <li>✅ Email breach check (HaveIBeenPwned)</li>
                <li>✅ Email validity & deliverability</li>
                <li>✅ Phone spam/fraud reputation</li>
                <li>✅ Unified risk score</li>
                <li>✅ Actionable recommendations (PDF report)</li>
              </ul>
              <button
                disabled
                className="bg-slate-200 text-slate-500 px-6 py-2 rounded-xl font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
              <p className="text-xs text-slate-400 mt-3">Launching end of July 2026</p>
            </div>

            {/* Full Package */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">R59</div>
              <div className="text-slate-500 mb-6">one‑time scan</div>
              <h3 className="text-xl font-bold mb-3">Full Digital Footprint</h3>
              <ul className="text-left text-sm text-slate-600 space-y-2 mb-6">
                <li>✅ Everything in Email + Phone Scan</li>
                <li>✅ Device security audit (browser, HTTPS, headers)</li>
                <li>✅ Dark web monitoring (Phase 2)</li>
                <li>✅ Priority support</li>
                <li>✅ Detailed remediation checklist</li>
              </ul>
              <button
                disabled
                className="bg-slate-200 text-slate-500 px-6 py-2 rounded-xl font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
              <p className="text-xs text-slate-400 mt-3">Launching end of July 2026</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">
            🔒 No subscription. Your data is never stored. Pay once, get your report instantly.
          </p>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Be the First to Scan</h2>
          <p className="text-slate-600 mb-6">
            We’re putting the final touches on the Digital Footprint Scanner.  
            Leave your email and we’ll notify you as soon as it launches – plus a special launch discount.
          </p>
          {waitlistSubmitted ? (
            <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">
              ✅ You're on the list! We'll be in touch.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Notify Me
              </button>
            </form>
          )}
          <p className="text-xs text-slate-500 mt-4">We respect your privacy. No spam, unsubscribe anytime.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <summary className="font-semibold cursor-pointer">What exactly does the scanner check?</summary>
            <p className="text-slate-600 mt-2">
              The Email + Phone scan checks your email address against data breaches (HaveIBeenPwned), validates deliverability, and assesses phone number spam/fraud risk. The Full scan adds a device security audit (browser, HTTPS, security headers) and will include dark web monitoring in Phase 2.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <summary className="font-semibold cursor-pointer">Is my data stored or shared?</summary>
            <p className="text-slate-600 mt-2">
              No. We never store your email, phone number, or any scan results. The scan runs in real‑time and the report is deleted after you close the page. We comply with POPIA.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <summary className="font-semibold cursor-pointer">What payment methods do you accept?</summary>
            <p className="text-slate-600 mt-2">
              We accept all major credit/debit cards via Stripe. South African cards and instant EFT will also be supported via PayFast (coming soon).
            </p>
          </details>
          <details className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <summary className="font-semibold cursor-pointer">When will the scanner be available?</summary>
            <p className="text-slate-600 mt-2">
              We are launching at the end of July 2026. Join the waitlist above to get early access and a launch discount.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <Link href="/" className="hover:text-indigo-600">← Back to Scam Verification Engine</Link>
        <div className="mt-2 space-x-4">
          <Link href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">© 2026 The Link Digital Security. All rights reserved.</p>
      </footer>
    </main>
  );
}
