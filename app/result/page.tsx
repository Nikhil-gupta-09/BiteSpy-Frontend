"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

function ResultContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") ?? "nutella";
  const yesCount = Number(searchParams.get("yes") ?? "0");

  const truthScore = useMemo(() => {
    const base = 4.5;
    const bump = yesCount * 0.4;
    const score = Math.max(2.8, Math.min(7.2, base + bump));
    return Number(score.toFixed(1));
  }, [yesCount]);

  const meterPercent = (truthScore / 10) * 100;

  return (
    <main className="min-h-screen pb-16">
      <Navbar />

      <section className="mx-auto w-full max-w-5xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Reality Report: {product}</h1>
        <p className="mt-3 max-w-3xl text-blue-100">
          Hardcoded demo response for Nutella label analysis. In production this data will come from your MCP backend.
        </p>

        <div className="mt-8 rounded-3xl border border-white/20 bg-[#071340]/80 p-7 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Truth-o-meter</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-6xl font-black text-white">{truthScore}</p>
            <p className="pb-2 text-lg font-semibold text-blue-100">/ 10 reliability</p>
          </div>

          <div className="mt-5 h-4 rounded-full bg-white/15">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-red-300 via-amber-300 to-emerald-300 transition-all duration-500"
              style={{ width: `${meterPercent}%` }}
            />
          </div>

          <p className="mt-4 text-blue-100">
            Branding says &quot;breakfast happiness&quot; but formula is mostly sugar + palm oil with low cocoa concentration.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-6">
            <h2 className="text-xl font-bold text-emerald-100">Nutrient Highlights</h2>
            <ul className="mt-3 space-y-2 text-emerald-50">
              <li>Small amount of iron from cocoa</li>
              <li>Contains some calcium from skim milk powder</li>
              <li>Quick energy from carbs (short-term)</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-red-300/30 bg-red-400/10 p-6">
            <h2 className="text-xl font-bold text-red-100">Alerts For You</h2>
            <ul className="mt-3 space-y-2 text-red-50">
              <li>High added sugar can spike glucose</li>
              <li>Palm oil is highly processed fat</li>
              <li>Very low fiber and low protein</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-orange-300/30 bg-orange-400/10 p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-orange-100">Ingredient Reality Check</h2>
            <p className="mt-3 text-orange-50">
              The top ingredients are sugar and palm oil. Hazelnut and cocoa are present but in lower proportions than the branding strongly implies.
              This means taste-first profile, not a nutrient-dense spread.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/alternatives"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[#08225a] transition hover:scale-[1.02]"
          >
            Show Better Alternatives
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Scan Another Product
          </Link>
        </div>
      </section>
    </main>
  );
}

function ResultFallback() {
  return (
    <main className="min-h-screen pb-16">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Preparing Reality Report...</h1>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultFallback />}>
      <ResultContent />
    </Suspense>
  );
}
