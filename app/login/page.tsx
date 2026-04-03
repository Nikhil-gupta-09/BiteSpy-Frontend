"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiPhone,
  FiLock,
} from "react-icons/fi";

type Mode = "email" | "phone";

type LoginData = {
  email: string;
  phone: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("email");
  const [form, setForm] = useState<LoginData>({
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhoneToEmail = (phone: string): string => {
    const cleaned = phone.replace(/\s+/g, "");
    return `${cleaned}@phone.bitespy.com`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const emailToUse =
        mode === "email" ? form.email : normalizePhoneToEmail(form.phone);

      await signInWithEmailAndPassword(auth, emailToUse, form.password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* FULL SCREEN LAYOUT */
    <div className="flex h-screen w-full overflow-hidden">
        
      {/* LEFT SIDE - FORM (White Background, Full Height) */}
      <div className="w-full md:w-[450px] lg:w-[500px] h-full bg-white p-8 md:p-12 flex flex-col justify-center border-r border-gray-400 shrink-0 overflow-y-auto">
        
        <div className="max-w-sm w-full mx-auto">
          {/* HEADING */}
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-5 border border-gray-200">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${
                mode === "email"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <FiMail size={16} />
              Email
            </button>

            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${
                mode === "phone"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <FiPhone size={16} />
              Phone
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* INPUT */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {mode === "email" ? <FiMail /> : <FiPhone />}
              </span>

              <input
                type={mode === "email" ? "email" : "tel"}
                name={mode === "email" ? "email" : "phone"}
                placeholder={mode === "email" ? "Email" : "Phone number"}
                value={mode === "email" ? form.email : form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* FORGOT */}
            <div className="text-right">
              <Link href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              disabled={loading}
              className="w-full py-2.5 rounded-md font-medium 
              bg-[#030f36] text-white
              hover:bg-[#030f36]/90 
              shadow-md shadow-black/10
              transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* SIGNUP */}
            <div className="text-center mt-4">
              <span className="text-xs text-gray-500">Don't have an account? </span>
              <Link
                href="/signup"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Create account
              </Link>
            </div>

          </form>
        </div>
      </div>

      {/* RIGHT SIDE - COLORLESS/TRANSPARENT (Full Height & Remaining Width) */}
      <div className="hidden md:block flex-1 h-full bg-transparent"></div>

    </div>
  );
}