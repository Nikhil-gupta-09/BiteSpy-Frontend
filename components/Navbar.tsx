"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { FiArrowRight, FiUser, FiLogOut } from "react-icons/fi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser({ email: authUser.email || "" });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setDropdownOpen(false);
  };

  return (
    <nav
      className="absolute top-0 left-0 w-full z-50 
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

          {/* INSIGHTS */}
          <Link
            href="/insights"
            className="relative text-sm font-medium text-blue-100 
            transition-all duration-300
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] 
            after:bg-white after:transition-all after:duration-300
            hover:text-white hover:after:w-full"
          >
            BiteSpy Insight
          </Link>

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

          {/* DYNAMIC AUTH SECTION */}
          {!loading && (
            <>
              {user ? (
                // LOGGED IN - ACCOUNT DROPDOWN
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full 
                    bg-white/10 border border-white/20 text-white hover:bg-white/20 
                    transition-all duration-300"
                    title={user.email}
                  >
                    <FiUser size={18} />
                  </button>

                  {/* DROPDOWN MENU */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#030f36] border border-white/20 
                    rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      
                      {/* EMAIL DISPLAY */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-gray-400">Logged in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>

                      {/* PROFILE BUTTON */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 
                        transition-colors duration-200 flex items-center gap-2"
                      >
                        <FiUser size={16} />
                        View Profile
                      </button>

                      {/* LOGOUT BUTTON */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 
                        transition-colors duration-200 flex items-center gap-2 border-t border-white/10"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // NOT LOGGED IN - LOGIN & SIGNUP BUTTONS
                <>
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

                  {/* GET STARTED (SIGNUP) */}
                  <Link href="/signup">
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
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}