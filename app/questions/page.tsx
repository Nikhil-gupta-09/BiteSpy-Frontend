"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheck, FiX } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import type { IngredientQuestion, ScanResult, UserAnswer } from "@/lib/claim-analysis";

const FALLBACK_QUESTIONS: IngredientQuestion[] = [
  { id: "q1", text: "Do you have any allergy concern with this product?", focus: "allergy" },
  { id: "q2", text: "Does this usually trigger bloating or digestion issues for you?", focus: "health" },
  { id: "q3", text: "Do you want to avoid added sugar or sweeteners here?", focus: "health" },
  { id: "q4", text: "Would you rather skip products with a lot of additives?", focus: "preference" },
  { id: "q5", text: "Is lower sodium important for your routine?", focus: "health" },
];

const QUESTION_POOL: IngredientQuestion[] = [
  { id: "q1", text: "Do you have any allergy concern with this product?", focus: "allergy" },
  { id: "q2", text: "Does this usually trigger bloating or digestion issues for you?", focus: "health" },
  { id: "q3", text: "Do you want to avoid added sugar or sweeteners here?", focus: "health" },
  { id: "q4", text: "Would you rather skip products with a lot of additives?", focus: "preference" },
  { id: "q5", text: "Is lower sodium important for your routine?", focus: "health" },
  { id: "q6", text: "Do you prefer cleaner labels with fewer ingredients?", focus: "preference" },
  { id: "q7", text: "Do you want a higher protein or fiber option?", focus: "preference" },
  { id: "q8", text: "Do dairy or gluten limits matter for you?", focus: "allergy" },
];

const MAX_QUESTIONS = 5;
const MIN_QUESTIONS = 2;

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function buildQuestionSet(baseQuestions: IngredientQuestion[], conditions: string[]) {
  const normalizedConditions = conditions.map(normalizeValue);

  const shouldSkip = (question: IngredientQuestion) => {
    const text = normalizeValue(question.text);

    if (normalizedConditions.some((condition) => condition.includes("diabetes") && /sugar|sweetener|glucose|carb|carbohydrate/.test(text))) {
      return true;
    }

    if (normalizedConditions.some((condition) => /allergy|intolerance|sensitivity/.test(condition) && /allerg|nut|peanut|tree nut|dairy|gluten|soy|lactose/.test(text))) {
      return true;
    }

    if (normalizedConditions.some((condition) => /bloating|ibs|acid reflux|reflux/.test(condition) && /bloating|digestion|gas|stomach|heartburn|reflux|ibs/.test(text))) {
      return true;
    }

    return normalizedConditions.some((condition) => condition.includes("thyroid") && /iodine|seaweed|sugar|energy/.test(text));
  };

  const merged: IngredientQuestion[] = [];
  const seen = new Set<string>();

  for (const question of baseQuestions) {
    const key = normalizeValue(question.text);
    if (!seen.has(key) && !shouldSkip(question)) {
      merged.push(question);
      seen.add(key);
    }
  }

  for (const question of QUESTION_POOL) {
    const key = normalizeValue(question.text);
    if (merged.length >= MAX_QUESTIONS) {
      break;
    }

    if (!seen.has(key) && !shouldSkip(question)) {
      merged.push(question);
      seen.add(key);
    }
  }

  if (merged.length < MIN_QUESTIONS) {
    for (const question of QUESTION_POOL) {
      const key = normalizeValue(question.text);
      if (merged.length >= MIN_QUESTIONS) {
        break;
      }

      if (!seen.has(key)) {
        merged.push(question);
        seen.add(key);
      }
    }
  }

  return merged.slice(0, MAX_QUESTIONS);
}

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") ?? "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [baseQuestions, setBaseQuestions] = useState<IngredientQuestion[]>(FALLBACK_QUESTIONS);
  const [profileConditions, setProfileConditions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Array<boolean | null>>(new Array(FALLBACK_QUESTIONS.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const questions = useMemo(
    () => buildQuestionSet(baseQuestions, profileConditions),
    [baseQuestions, profileConditions]
  );

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers(new Array(questions.length).fill(null));
  }, [questions]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { conditions?: string[] };
        if (!isMounted) {
          return;
        }

        setProfileConditions(Array.isArray(payload.conditions) ? payload.conditions : []);
      } catch {
        if (isMounted) {
          setProfileConditions([]);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
          setBaseQuestions(resolved);
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
        setBaseQuestions(resolved);
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
              className="h-3 rounded-full bg-linear-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
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

          <p className="mt-3 text-sm text-blue-100/80">
            We skip topics you already listed in your profile, so the questions stay short and relevant.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseAnswer(true)}
              aria-label="Tick"
              className="flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-emerald-300/40 bg-emerald-400/15 px-6 py-6 text-white transition hover:scale-[1.02] hover:bg-emerald-300/20"
            >
              <FiCheck className="text-5xl text-emerald-200" />
              <span className="mt-3 text-xs uppercase tracking-[0.18em] text-emerald-100">Keep</span>
            </button>

            <button
              type="button"
              onClick={() => chooseAnswer(false)}
              aria-label="Cross"
              className="flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-orange-300/40 bg-orange-300/15 px-6 py-6 text-white transition hover:scale-[1.02] hover:bg-orange-300/20"
            >
              <FiX className="text-5xl text-orange-100" />
              <span className="mt-3 text-xs uppercase tracking-[0.18em] text-orange-100">Skip</span>
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
