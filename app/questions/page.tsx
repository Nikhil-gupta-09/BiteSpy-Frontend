"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const QUESTIONS = [
  "Do you want a spread with low added sugar?",
  "Do you prefer palm-oil-free products?",
  "Is cocoa percentage important to you?",
  "Would you like less processed ingredients?",
  "Do you care about high fiber in your breakfast spread?",
];

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") ?? "nutella";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<boolean | null>>(new Array(QUESTIONS.length).fill(null));

  const progress = useMemo(() => ((currentIndex + 1) / QUESTIONS.length) * 100, [currentIndex]);

  const chooseAnswer = (value: boolean) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = value;
    setAnswers(nextAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 180);
      return;
    }

    const yesCount = nextAnswers.filter((item) => item === true).length;
    router.push(`/processing?product=${encodeURIComponent(product)}&yes=${yesCount}`);
  };

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
          <p className="mt-2 text-sm text-blue-100">Question {currentIndex + 1} of {QUESTIONS.length}</p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-[#071340]/80 p-8 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-200">BiteSpy Friendly Check</p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {QUESTIONS[currentIndex]}
          </h1>

          <p className="mt-4 text-blue-100">
            Product in scan queue: <span className="font-semibold capitalize text-white">{product}</span>
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
