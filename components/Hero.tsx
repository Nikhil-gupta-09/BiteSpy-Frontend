"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen px-16 pt-32 pb-20 
      grid lg:grid-cols-2 gap-16 items-center text-white overflow-hidden"
    >
      {/* LEFT CONTENT */}
      <div className="z-10 relative">
        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
          Expose the{" "}
          <span
            className="
              italic font-serif 
              bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-200 
              bg-clip-text text-transparent
              drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]
            "
          >
            truth
          </span>
          <br />
          behind your food.
        </h1>

        <p className="text-blue-200 mb-8 max-w-xl text-lg">
          BiteSpy uses AI to uncover hidden ingredients, fake health claims,
          and misleading labels — giving you a clear, honest breakdown of
          what you're really consuming.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() =>
              document
                .getElementById("upload-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 rounded-lg font-medium 
            bg-[#f1f5f9] text-[#030f36]
            hover:bg-[#e2e8f0] 
            shadow-lg shadow-black/20
            hover:scale-[1.05] active:scale-[0.95] transition"
          >
            Scan a Product
          </button>

          <Link
            href="/insights"
            className="px-6 py-3 rounded-lg 
            bg-white/10 border border-white/20 
            text-blue-100 
            hover:bg-white/20 
            transition"
          >
            See How It Works
          </Link>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative flex justify-center items-center z-10 h-[500px]">

        {/* 🦝 RACCOON */}
        <motion.div
          className="absolute scale-[2.6]"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
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
          />
        </motion.div>

        {/* 🍎 APPLE */}
        <motion.div
          className="absolute right-[-10px] bottom-[40px] scale-[1.3]"
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
          />
        </motion.div>

        {/* 🔍 SCANNER */}
        <motion.div
          className="absolute left-[-20px] top-[30px] scale-[2]"
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
          />
        </motion.div>

      </div>
    </section>
  );
}