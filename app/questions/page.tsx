"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { IngredientQuestion, ScanResult, UserAnswer } from "@/lib/claim-analysis";

const FALLBACK_QUESTIONS: IngredientQuestion[] = [
  { id: "q1", text: "Do you avoid high added sugar products?", focus: "health" },
  { id: "q2", text: "Do you need allergen-safe options (nuts, dairy, soy)?", focus: "allergy" },
  { id: "q3", text: "Do you prefer low-processing ingredients?", focus: "preference" },
  { id: "q4", text: "Is low saturated fat important for your routine?", focus: "health" },
  { id: "q5", text: "Do you prioritize cleaner label claims?", focus: "preference" },
];

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [questions, setQuestions] = useState<IngredientQuestion[]>(FALLBACK_QUESTIONS);
  const [answers, setAnswers] = useState<Array<boolean | null>>(new Array(FALLBACK_QUESTIONS.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadScan = async () => {
      if (!scanId) {
        setError("Missing scan ID. Please upload a product image first.");
        setLoading(false);
        return;
      }

      try {
        const cached = sessionStorage.getItem(`bitespy:scan:${scanId}`);
        if (cached) {
          const parsed = JSON.parse(cached) as ScanResult;
          if (!isMounted) {
            return;
          }

          const resolved = parsed.questions.length ? parsed.questions : FALLBACK_QUESTIONS;
          setScan(parsed);
          setQuestions(resolved);
          setAnswers(new Array(resolved.length).fill(null));
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/scan?scanId=${encodeURIComponent(scanId)}`);
        const payload = (await response.json()) as ScanResult | { error?: string };

        if (!response.ok || !("scanId" in payload)) {
          setError("error" in payload && payload.error ? payload.error : "Could not load scan details.");
          setLoading(false);
          return;
        }

        if (!isMounted) {
          return;
        }

        sessionStorage.setItem(`bitespy:scan:${payload.scanId}`, JSON.stringify(payload));
        const resolved = payload.questions.length ? payload.questions : FALLBACK_QUESTIONS;
        setScan(payload);
        setQuestions(resolved);
        setAnswers(new Array(resolved.length).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load scan details.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadScan();

    return () => {
      isMounted = false;
    };
  }, [scanId]);

  const progress = useMemo(() => ((currentIndex + 1) / Math.max(questions.length, 1)) * 100, [currentIndex, questions.length]);

  const chooseAnswer = (value: boolean) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = value;
    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 180);
      return;
    }

    const payload: UserAnswer[] = questions.map((question, index) => ({
      questionId: question.id,
      question: question.text,
      answer: nextAnswers[index] === true,
    }));

    sessionStorage.setItem(`bitespy:answers:${scanId}`, JSON.stringify(payload));
    router.push(`/processing?scanId=${encodeURIComponent(scanId)}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 pt-28 pb-16">
          <div className="rounded-3xl border border-white/20 bg-[#071340]/80 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-lg font-semibold text-white">Loading personalized ingredient questions...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 pt-28 pb-16">
          <div className="rounded-3xl border border-red-300/40 bg-red-400/10 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-lg font-semibold text-red-100">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 rounded-xl border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/10"
            >
              Go back to upload
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 pt-28 pb-16">
        <div className="mb-8 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
          <div className="h-3 rounded-full bg-white/20">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-blue-100">Question {currentIndex + 1} of {questions.length}</p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-[#071340]/80 p-8 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-200">BiteSpy Friendly Check</p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {questions[currentIndex]?.text}
          </h1>

          <p className="mt-4 text-blue-100">
            Product in scan queue: <span className="font-semibold capitalize text-white">{scan?.productName ?? "Unknown"}</span>
          </p>

          <p className="mt-1 text-sm text-cyan-100/90">
            Focus: {questions[currentIndex]?.focus ?? "preference"}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseAnswer(true)}
              className="rounded-2xl border-2 border-emerald-300/40 bg-emerald-400/15 px-6 py-6 text-left text-white transition hover:scale-[1.02] hover:bg-emerald-300/20"
            >
              <span className="block text-xs uppercase tracking-[0.18em] text-emerald-200">Yes</span>
              <span className="mt-1 block text-xl font-semibold">Yes, that matters</span>
            </button>

            <button
              type="button"
              onClick={() => chooseAnswer(false)}
              className="rounded-2xl border-2 border-orange-300/40 bg-orange-300/15 px-6 py-6 text-left text-white transition hover:scale-[1.02] hover:bg-orange-300/20"
            >
              <span className="block text-xs uppercase tracking-[0.18em] text-orange-100">No</span>
              <span className="mt-1 block text-xl font-semibold">No, not important now</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuestionsFallback() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 pt-28 pb-16">
        <div className="rounded-3xl border border-white/20 bg-[#071340]/80 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">Loading your question set...</p>
        </div>
      </section>
    </main>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<QuestionsFallback />}>
      <QuestionsContent />
    </Suspense>
  );
}
