"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { AlternativeProduct, AnalysisResult } from "@/lib/claim-analysis";

function fitStyle(fit: AlternativeProduct["fit"]): string {
  if (fit === "healthier") {
    return "border-emerald-300/40 bg-emerald-400/10 text-emerald-50";
  }
  if (fit === "allergy-safe") {
    return "border-red-300/40 bg-red-400/10 text-red-50";
  }
  if (fit === "budget") {
    return "border-cyan-300/40 bg-cyan-400/10 text-cyan-50";
  }
  return "border-amber-300/40 bg-amber-400/10 text-amber-50";
}

function fitTitle(fit: AlternativeProduct["fit"]): string {
  if (fit === "healthier") {
    return "Healthier";
  }
  if (fit === "allergy-safe") {
    return "Allergy Safe";
  }
  if (fit === "budget") {
    return "Budget";
  }
  return "Preference Match";
}

function AlternativesContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") ?? "";

  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!scanId) {
        return;
      }

      const cached = sessionStorage.getItem(`bitespy:result:${scanId}`);
      if (cached) {
        if (mounted) {
          setResult(JSON.parse(cached) as AnalysisResult);
        }
        return;
      }

      try {
        const response = await fetch(`/api/analyze?scanId=${encodeURIComponent(scanId)}`);
        const payload = (await response.json()) as AnalysisResult | { error?: string };

        if (!response.ok || !("scanId" in payload)) {
          return;
        }

        sessionStorage.setItem(`bitespy:result:${scanId}`, JSON.stringify(payload));
        if (mounted) {
          setResult(payload);
        }
      } catch {
        if (mounted) {
          setResult(null);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [scanId]);

  const alternatives = useMemo(() => result?.alternatives ?? [], [result?.alternatives]);

  return (
    <main className="min-h-screen pb-16">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Better Alternatives</h1>
        <p className="mt-3 max-w-3xl text-blue-100">
          Tailored options for {result?.productName ?? "your scanned product"} based on your health, allergy, and preference choices.
        </p>

        {alternatives.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {alternatives.map((item, index) => (
              <article key={`${item.name}-${index}`} className={`rounded-2xl border p-6 ${fitStyle(item.fit)}`}>
                <p className="text-sm uppercase tracking-[0.16em]">{fitTitle(item.fit)}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{item.name}</h2>
                <p className="mt-4">{item.reason}</p>
                <p className="mt-3 text-sm opacity-90">Price tier: {item.priceTier}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 text-blue-100">
            Alternatives are not available yet. Go back to result and rerun scan flow.
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[#08225a] transition hover:scale-[1.02]"
          >
            Back To Home
          </Link>
          <Link
            href={scanId ? `/questions?scanId=${encodeURIComponent(scanId)}` : "/"}
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Retake Questions
          </Link>
        </div>
      </section>
    </main>
  );
}

function AlternativesFallback() {
  return (
    <main className="min-h-screen pb-16">
      <Navbar />
      <section className="mx-auto w-full max-w-6xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Loading alternatives...</h1>
      </section>
    </main>
  );
}

export default function AlternativesPage() {
  return (
    <Suspense fallback={<AlternativesFallback />}>
      <AlternativesContent />
    </Suspense>
  );
}
