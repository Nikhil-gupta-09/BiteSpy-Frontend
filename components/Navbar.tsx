"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { FiArrowRight } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 
      border-b border-none
      backdrop-blur-md "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">

        {/* LEFT */}
        <div className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.03]">
          <Logo />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-8">

          {/* NEWS */}
          <Link
            href="/news"
            className="relative text-sm font-medium text-blue-100 
            transition-all duration-300
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] 
            after:bg-white after:transition-all after:duration-300
            hover:text-white hover:after:w-full"
          >
            News
          </Link>

          {/* LOGIN */}
          <Link
            href="/login"
            className="relative text-sm font-medium text-blue-100 
            transition-all duration-300
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] 
            after:bg-white after:transition-all after:duration-300
            hover:text-white hover:after:w-full"
          >
            Login
          </Link>

          {/* CTA */}
          <button
            className="group relative flex items-center gap-2 
            bg-white text-[#007BFF] px-5 py-2.5 rounded-full text-sm font-semibold 
            overflow-hidden transition-all duration-300
            hover:scale-[1.05] active:scale-[0.95]"
          >
            {/* shine effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" />

            <span className="relative z-10">Get Started</span>

            <FiArrowRight
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}