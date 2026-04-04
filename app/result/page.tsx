"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { AnalysisResult } from "@/lib/claim-analysis";

function isAnalysisResult(payload: unknown): payload is AnalysisResult {
  return Boolean(payload && typeof payload === "object" && "scanId" in payload && "claimOMeter" in payload);
}

function fallbackResult(scanId: string): AnalysisResult {
  return {
    scanId,
    productName: "Scanned Product",
    claimOMeter: 5,
    verdict: "Mixed trust profile",
    personalizedSummary:
      "We could not fetch full AI analysis this time, but based on common labeling patterns this product may contain both useful and misleading claims.",
    falseClaims: [
      "Health-forward branding may overstate nutrition density.",
      "Front-of-pack claims may not reflect top listed ingredients.",
    ],
    harmfulIngredients: [
      {
        name: "High added sugar",
        risk: "Metabolic strain",
        whyItMatters: "Frequent intake may increase glucose spikes and long-term cardiometabolic risk.",
      },
      {
        name: "Highly refined oil",
        risk: "Low nutrient quality",
        whyItMatters: "Can displace whole-food fat sources with limited micronutrient value.",
      },
    ],
    labelAlerts: ["Check serving size", "Watch total added sugars", "Review allergen statement"],
    goodPoints: ["Convenient", "May provide quick energy"],
    recommendedLabels: ["Low added sugar", "High fiber", "No artificial color"],
    ingredients: ["Unknown from fallback"],
    alternatives: [
      {
        name: "Unsweetened nut spread",
        reason: "Lower sugar and cleaner ingredient profile.",
        fit: "healthier",
        priceTier: "medium",
      },
      {
        name: "Seed-based allergy-safe spread",
        reason: "Works better if nut allergies are a concern.",
        fit: "allergy-safe",
        priceTier: "medium",
      },
      {
        name: "Homemade cocoa-date mix",
        reason: "Better control over sweetness and ingredient quality.",
        fit: "budget",
        priceTier: "low",
      },
    ],
  };
}

function meterColor(score: number): string {
  if (score >= 7.5) {
    return "text-emerald-100";
  }
  if (score >= 4.5) {
    return "text-amber-100";
  }
  return "text-red-100";
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") ?? "";
  const hasFallbackFlag = searchParams.get("fallback") === "1";

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareName, setShareName] = useState("Anonymous Spy");
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!scanId) {
        setResult(fallbackResult("no-scan"));
        setLoading(false);
        return;
      }

      try {
        const cached = sessionStorage.getItem(`bitespy:result:${scanId}`);
        if (cached) {
          const parsed = JSON.parse(cached) as AnalysisResult;
          if (mounted) {
            setResult(parsed);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`/api/analyze?scanId=${encodeURIComponent(scanId)}`);
        const payload = (await response.json()) as AnalysisResult | { error?: string };

        if (!response.ok || !isAnalysisResult(payload)) {
          throw new Error("Unable to fetch analysis");
        }

        sessionStorage.setItem(`bitespy:result:${scanId}`, JSON.stringify(payload));
        if (mounted) {
          setResult(payload);
        }
      } catch {
        if (mounted) {
          setResult(fallbackResult(scanId));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [scanId]);

  useEffect(() => {
    const stored = sessionStorage.getItem("bitespy:community:authorName");
    if (stored?.trim()) {
      setShareName(stored.trim());
    }
  }, []);

  const shareToCommunity = async () => {
    if (!result || isSharing) {
      return;
    }

    setIsSharing(true);
    setShareError("");
    setShareSuccess("");

    const authorName = shareName.trim() || "Anonymous Spy";

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName,
          result,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Failed to share result.");
      }

      sessionStorage.setItem("bitespy:community:authorName", authorName);
      setShareSuccess("Shared to community digest.");
    } catch (error) {
      setShareError(error instanceof Error ? error.message : "Could not share this report.");
    } finally {
      setIsSharing(false);
    }
  };

  const meterPercent = useMemo(() => {
    if (!result) {
      return 0;
    }
    return (result.claimOMeter / 10) * 100;
  }, [result]);

  if (loading || !result) {
    return (
      <main className="min-h-screen pb-16">
        <Navbar />
        <section className="mx-auto w-full max-w-5xl px-6 pt-28">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">Preparing Claim-O-Meter report...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Navbar />

      <section className="mx-auto w-full max-w-5xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Reality Report: {result.productName}</h1>
        <p className="mt-3 max-w-3xl text-blue-100">{result.personalizedSummary}</p>

        {hasFallbackFlag ? (
          <p className="mt-3 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
            Showing fallback data because live Gemini analysis could not complete in time.
          </p>
        ) : null}

        <div className="mt-8 rounded-3xl border border-white/20 bg-[#071340]/80 p-7 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Claim-O-Meter</p>
          <div className="mt-3 flex items-end gap-3">
            <p className={`text-6xl font-black ${meterColor(result.claimOMeter)}`}>{result.claimOMeter}</p>
            <p className="pb-2 text-lg font-semibold text-blue-100">/ 10 trust score</p>
          </div>

          <div className="mt-5 h-4 rounded-full bg-white/15">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-red-300 via-amber-300 to-emerald-300 transition-all duration-500"
              style={{ width: `${meterPercent}%` }}
            />
          </div>

          <p className="mt-4 text-blue-100">Verdict: {result.verdict}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-red-300/30 bg-red-400/10 p-6">
            <h2 className="text-xl font-bold text-red-100">Likely False Or Misleading Claims</h2>
            <ul className="mt-3 space-y-2 text-red-50">
              {result.falseClaims.map((claim, index) => (
                <li key={`${claim}-${index}`}>{claim}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-6">
            <h2 className="text-xl font-bold text-emerald-100">Positive Signals</h2>
            <ul className="mt-3 space-y-2 text-emerald-50">
              {result.goodPoints.map((point, index) => (
                <li key={`${point}-${index}`}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-orange-300/30 bg-orange-400/10 p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-orange-100">Harmful Ingredients</h2>
            <ul className="mt-3 space-y-3 text-orange-50">
              {result.harmfulIngredients.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <span className="font-semibold">{item.name}</span> - {item.risk}. {item.whyItMatters}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-6">
            <h2 className="text-xl font-bold text-cyan-100">Label Alerts</h2>
            <ul className="mt-3 space-y-2 text-cyan-50">
              {result.labelAlerts.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-indigo-300/30 bg-indigo-400/10 p-6">
            <h2 className="text-xl font-bold text-indigo-100">Labels To Prefer Next Time</h2>
            <ul className="mt-3 space-y-2 text-indigo-50">
              {result.recommendedLabels.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/alternatives?scanId=${encodeURIComponent(result.scanId)}`}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[#08225a] transition hover:scale-[1.02]"
          >
            Show Better Alternatives
          </Link>
          <button
            type="button"
            onClick={() => void shareToCommunity()}
            disabled={isSharing}
            className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-[#08225a] transition hover:scale-[1.02] disabled:opacity-60"
          >
            {isSharing ? "Sharing..." : "Share To Community"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Scan Another Product
          </button>
          <Link
            href="/community"
            className="rounded-xl border border-cyan-300/40 px-6 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
          >
            Open Community
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={shareName}
            onChange={(event) => setShareName(event.target.value)}
            placeholder="Name to show in community"
            className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-blue-200/70"
          />
          {shareSuccess ? (
            <p className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
              {shareSuccess}
            </p>
          ) : null}
          {shareError ? (
            <p className="rounded-xl border border-red-300/40 bg-red-400/10 px-4 py-2 text-sm text-red-100">{shareError}</p>
          ) : null}
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
