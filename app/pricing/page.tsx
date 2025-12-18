"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0616] px-6 py-20 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple Pricing
          </h1>
          <p className="mt-3 text-white/70">
            No hidden charges. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* Monthly */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Monthly</h2>

            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold">₹49</span>
              <span className="text-white/60">/month</span>
            </div>

            <ul className="space-y-3 text-sm text-white/80 mb-8">
              <li>✔ Unlimited Todos</li>
              <li>✔ Priority Support</li>
              <li>✔ Cloud Sync</li>
              <li>✔ Future AI Features</li>
            </ul>

            <Link
              href="/checkout?plan=monthly"
              className="block w-full rounded-xl border border-white/20 py-3 text-center font-medium hover:bg-white/10 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Yearly */}
          <div className="relative rounded-2xl border border-pink-500/40 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 backdrop-blur-xl shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1 text-xs font-semibold">
              BEST VALUE
            </span>

            <h2 className="text-xl font-semibold mb-2">Yearly</h2>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold">₹449</span>
              <span className="text-white/60">/year</span>
            </div>

            <p className="text-sm text-green-400 mb-6">
              Save ₹259 compared to monthly
            </p>

            <ul className="space-y-3 text-sm text-white/80 mb-8">
              <li>✔ Unlimited Todos</li>
              <li>✔ Priority Support</li>
              <li>✔ Cloud Sync</li>
              <li>✔ Future AI Features</li>
            </ul>

            <Link
              href="/checkout?plan=yearly"
              className="block w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-center font-semibold text-white hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
