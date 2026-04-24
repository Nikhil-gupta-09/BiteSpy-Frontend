"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { FiArrowRight, FiUser, FiLogOut, FiClock, FiEdit3 } from "react-icons/fi";

interface SessionUser {
  email: string;
  fullName: string;
  verified: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { user?: SessionUser | null };
        if (!active) {
          return;
        }

        setUser(payload.user ?? null);
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
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

  const handleHistoryClick = () => {
    router.push("/#upload-section");
    setDropdownOpen(false);
  };

  const handlePostClick = () => {
    router.push("/community?compose=1");
    setDropdownOpen(false);
  };

  return (
    <nav
      className="absolute top-0 left-0 w-full z-50"
      style={{
        background: "rgba(6, 14, 31, 0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(59, 130, 246, 0.18)",
        boxShadow: "0 2px 24px rgba(6, 14, 31, 0.30)",
      }}
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
            after:bg-blue-400 after:transition-all after:duration-300
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
            after:bg-blue-400 after:transition-all after:duration-300
            hover:text-white hover:after:w-full"
          >
            News
          </Link>

          <Link
            href="/community"
            className="relative text-sm font-medium text-blue-100
            transition-all duration-300
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px]
            after:bg-blue-400 after:transition-all after:duration-300
            hover:text-white hover:after:w-full"
          >
            Community
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
                    <div className="absolute right-0 mt-2 w-52 border border-white/15
                    rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ background: "rgba(8, 20, 39, 0.97)", backdropFilter: "blur(20px)" }}
                    >
                      {/* EMAIL DISPLAY */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-blue-300/70">Logged in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>

                      {/* PROFILE BUTTON */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-3 text-sm text-blue-100 hover:bg-white/8
                        transition-colors duration-200 flex items-center gap-2"
                      >
                        <FiUser size={16} />
                        View Profile
                      </button>

                      {/* HISTORY BUTTON */}
                      <button
                        onClick={handleHistoryClick}
                        className="w-full text-left px-4 py-3 text-sm text-blue-100 hover:bg-white/8
                        transition-colors duration-200 flex items-center gap-2"
                      >
                        <FiClock size={16} />
                        Search History
                      </button>

                      {user.verified ? (
                        <button
                          onClick={handlePostClick}
                          className="w-full text-left px-4 py-3 text-sm text-blue-100 hover:bg-white/8
                          transition-colors duration-200 flex items-center gap-2"
                        >
                          <FiEdit3 size={16} />
                          Post
                        </button>
                      ) : null}

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
                    after:bg-blue-400 after:transition-all after:duration-300
                    hover:text-white hover:after:w-full"
                  >
                    Login
                  </Link>

                  {/* GET STARTED (SIGNUP) */}
                  <Link href="/signup">
                    <button
                      className="group relative flex items-center gap-2
                      bg-gradient-to-r from-blue-600 to-blue-500 text-white
                      px-5 py-2.5 rounded-full text-sm font-semibold
                      overflow-hidden transition-all duration-300
                      hover:from-blue-500 hover:to-sky-500
                      hover:scale-[1.05] active:scale-[0.95]
                      shadow-lg shadow-blue-900/50"
                    >
                      {/* shine effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" />

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