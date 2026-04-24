"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="
      relative min-h-screen px-6 md:px-12 lg:px-20
      pt-36 pb-24
      grid lg:grid-cols-2 gap-12 items-center
      overflow-hidden text-white
      "
    >
      {/* 🔵 BACKGROUND BLOBS */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[380px] h-[380px] bg-sky-500/12 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-800/20 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT CONTENT */}
      <div className="relative z-10 max-w-xl">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase
          bg-blue-500/15 text-blue-300 border border-blue-400/25 mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          AI-Powered Food Analysis
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
          Expose the{" "}
          <span
            className="
              italic font-serif
              bg-gradient-to-r from-sky-300 via-blue-200 to-cyan-200
              bg-clip-text text-transparent
              drop-shadow-[0_0_18px_rgba(96,165,250,0.40)]
            "
          >
            truth
          </span>
          <br />
          behind your food.
        </h1>

        <p className="text-blue-100/80 mb-8 text-lg leading-relaxed">
          BiteSpy uses AI to uncover hidden ingredients, fake health claims,
          and misleading labels — giving you a clear, honest breakdown of
          what you&apos;re really consuming.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() =>
              document
                .getElementById("upload-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="
              px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-blue-600 to-blue-500 text-white
              hover:from-blue-500 hover:to-sky-500
              shadow-xl shadow-blue-900/40
              hover:scale-[1.05] active:scale-[0.95]
              transition-all duration-300
            "
          >
            Scan a Product
          </button>

          <Link
            href="/insights"
            className="
              px-6 py-3 rounded-xl font-medium
              bg-white/8 border border-white/18
              text-blue-100
              backdrop-blur-md
              hover:bg-white/14 hover:border-blue-400/40
              transition-all duration-300
            "
          >
            See How It Works
          </Link>
        </div>

        {/* STATS ROW */}
        <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
          {[
            { value: "50K+", label: "Products Scanned" },
            { value: "98%",  label: "Accuracy Rate" },
            { value: "12K+", label: "Happy Users" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-blue-300">{stat.value}</p>
              <p className="text-xs text-blue-200/60 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative flex justify-center items-center z-10 h-[450px] md:h-[520px]">

        {/* 🔵 GLOW */}
        <div className="absolute w-[320px] h-[320px] bg-blue-500/18 blur-3xl rounded-full -z-10" />

        {/* 🦝 RACCOON */}
        <motion.div
          className="absolute scale-[2.4] md:scale-[2.6]"
          style={{
            filter: "drop-shadow(0 22px 42px rgba(2,8,23,0.45))",
            width: "auto",
            height: "auto",
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/racoon.png"
            alt="Raccoon"
            width={280}
            height={280}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </motion.div>

        {/* 🍎 APPLE */}
        <motion.div
          className="absolute right-[-10px] bottom-[40px] scale-[1.2] md:scale-[1.3]"
          style={{ width: "auto", height: "auto" }}
          animate={{
            y: [0, -20, 0],
            x: [0, 12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/apple.png"
            alt="Apple"
            width={140}
            height={140}
            style={{ width: "auto", height: "auto" }}
          />
        </motion.div>

        {/* 🔍 SCANNER */}
        <motion.div
          className="absolute left-[-20px] top-[30px] scale-[1.8] md:scale-[2]"
          style={{ width: "auto", height: "auto" }}
          animate={{
            y: [0, -18, 0],
            x: [0, -12, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/scanner.png"
            alt="Scanner"
            width={140}
            height={140}
            style={{ width: "auto", height: "auto" }}
          />
        </motion.div>
      </div>
    </section>
  );
}