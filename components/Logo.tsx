"use client";

import Image from "next/image";
import Link from "next/link";
import mascot from "../public/logo_mascot.png";

export function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1 -ml-1 transition-all"
      aria-label="BiteSpy Home"
    >
      
      {/* Mascot Wrapper */}
      <div className="relative drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300">
        <Image
          src={mascot}
          alt="BiteSpy Mascot"
          /* Added a specific height to match width, prevented layout shifts, and added a playful rotation on hover */
          className="w-10 h-10 object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
          priority
        />
      </div>

      {/* Text */}
      <span className="font-medium text-xl tracking-tight leading-none flex items-center text-zinc-100">
        Bite
        {/* Added a subtle gradient to 'Spy' to make it pop without being overwhelmingly colorful */}
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 ml-[1px]">
          Spy
        </span>
      </span>

    </Link>
  );
}