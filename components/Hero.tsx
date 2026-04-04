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
      {/* 🔵 BACKGROUND BLOBS (for premium feel) */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-sky-400/18 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[350px] h-[350px] bg-cyan-300/18 blur-3xl rounded-full" />

      {/* LEFT CONTENT */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
          Expose the{" "}
          <span
            className="
              italic font-serif 
              bg-gradient-to-r from-sky-200 via-cyan-100 to-blue-100 
              bg-clip-text text-transparent
              drop-shadow-[0_0_12px_rgba(96,165,250,0.45)]
            "
          >
            truth
          </span>
          <br />
          behind your food.
        </h1>

        <p className="text-blue-50/85 mb-8 text-lg leading-relaxed">
          BiteSpy uses AI to uncover hidden ingredients, fake health claims,
          and misleading labels — giving you a clear, honest breakdown of
          what you're really consuming.
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
              px-6 py-3 rounded-xl font-medium 
              bg-white text-[#030f36]
              hover:bg-slate-100
              shadow-xl shadow-sky-900/20
              hover:scale-[1.05] active:scale-[0.95] 
              transition-all duration-300
            "
          >
            Scan a Product
          </button>

          <Link
            href="/insights"
            className="
              px-6 py-3 rounded-xl 
              bg-white/12 border border-white/20 
              text-blue-50 
              backdrop-blur-md
              hover:bg-white/18 
              transition-all duration-300
            "
          >
            See How It Works
          </Link>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative flex justify-center items-center z-10 h-[450px] md:h-[520px]">

        {/* 🦝 RACCOON */}
        <motion.div
          className="absolute scale-[2.4] md:scale-[2.6]"
          style={{
            filter: "drop-shadow(0 22px 42px rgba(2,8,23,0.38))",
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

        {/* 🔵 SOFT GLOW BEHIND */}
        <div className="absolute w-[300px] h-[300px] bg-sky-300/18 blur-3xl rounded-full -z-10" />
      </div>
    </section>
  );
}