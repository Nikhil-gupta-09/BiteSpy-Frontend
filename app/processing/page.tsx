"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { AnalysisResult, UserAnswer } from "@/lib/claim-analysis";

function isAnalysisResult(payload: unknown): payload is AnalysisResult {
  return Boolean(payload && typeof payload === "object" && "scanId" in payload && "claimOMeter" in payload);
}

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") ?? "";

  useEffect(() => {
    let isMounted = true;

    const runAnalysis = async () => {
      if (!scanId) {
        router.replace("/");
        return;
      }

      try {
        const answersRaw = sessionStorage.getItem(`bitespy:answers:${scanId}`);
        const answers = answersRaw ? (JSON.parse(answersRaw) as UserAnswer[]) : [];

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scanId, answers }),
        });

        const payload = (await response.json()) as AnalysisResult | { error?: string };

        if (!response.ok || !isAnalysisResult(payload)) {
          const message = "error" in payload && payload.error ? payload.error : "Could not build result report.";
          throw new Error(message);
        }

        sessionStorage.setItem(`bitespy:result:${scanId}`, JSON.stringify(payload));
        sessionStorage.setItem("bitespy:lastResultScanId", scanId);

        if (isMounted) {
          router.replace(`/result?scanId=${encodeURIComponent(scanId)}`);
        }
      } catch {
        if (isMounted) {
          router.replace(`/result?scanId=${encodeURIComponent(scanId)}&fallback=1`);
        }
      }
    };

    void runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [router, scanId]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 pt-24">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-cyan-200/40 border-t-cyan-200" />
        <h1 className="mt-8 text-center text-3xl font-bold text-white">Crunching label truth data...</h1>
        <p className="mt-3 text-center text-blue-100">
          BiteSpy is checking false claims, harmful ingredients, and safer alternatives.
        </p>
      </section>
    </main>
  );
}

function ProcessingFallback() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 pt-24">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-cyan-200/40 border-t-cyan-200" />
        <h1 className="mt-8 text-center text-3xl font-bold text-white">Preparing your report...</h1>
      </section>
    </main>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<ProcessingFallback />}>
      <ProcessingContent />
    </Suspense>
  );
}
