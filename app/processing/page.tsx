"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") ?? "nutella";
  const yes = searchParams.get("yes") ?? "0";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/result?product=${encodeURIComponent(product)}&yes=${yes}`);
    }, 2200);

    return () => clearTimeout(timer);
  }, [product, router, yes]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 pt-24">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-cyan-200/40 border-t-cyan-200" />
        <h1 className="mt-8 text-center text-3xl font-bold text-white">Crunching label truth data...</h1>
        <p className="mt-3 text-center text-blue-100">
          BiteSpy is cross-checking branding claims vs ingredient reality for {product}.
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
