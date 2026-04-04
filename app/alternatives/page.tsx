import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AlternativesPage() {
  return (
    <main className="min-h-screen pb-16">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 pt-28">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Better For You Alternatives</h1>
        <p className="mt-3 max-w-3xl text-blue-100">
          Three practical replacement paths based on your Nutella demo result.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-200">Healthier</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Cleaner Nutrition</h2>
            <ul className="mt-4 space-y-2 text-emerald-50">
              <li>100% peanut butter + cocoa blend</li>
              <li>Unsweetened hazelnut spread</li>
              <li>Dark cocoa tahini spread</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-cyan-200">Cheaper</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Budget Friendly</h2>
            <ul className="mt-4 space-y-2 text-cyan-50">
              <li>Store-brand cocoa spread (lower sugar version)</li>
              <li>Homemade date-cocoa spread</li>
              <li>Bulk roasted peanut + cocoa dip</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-amber-100">Same Taste</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Flavor Match</h2>
            <ul className="mt-4 space-y-2 text-amber-50">
              <li>70% hazelnut cocoa artisan spread</li>
              <li>No-palm chocolate hazelnut cream</li>
              <li>Stevia sweetened choco-hazelnut spread</li>
            </ul>
          </article>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[#08225a] transition hover:scale-[1.02]"
          >
            Back To Home
          </Link>
          <Link
            href="/questions?product=nutella"
            className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Retake Questions
          </Link>
        </div>
      </section>
    </main>
  );
}
