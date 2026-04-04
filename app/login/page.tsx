"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PROFILE_EMAIL_STORAGE_KEY, normalizeEmail } from "@/lib/profile";
import { Logo } from "@/components/Logo"; // 👈 ADD THIS

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

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailToUse,
          password: form.password,
        }),
      });

      if (!loginResponse.ok) {
        const body = (await loginResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Login failed");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          PROFILE_EMAIL_STORAGE_KEY,
          normalizeEmail(emailToUse)
        );
      }

      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* LEFT SIDE */}
      <div
        className="w-full h-full bg-transparent p-8 md:p-12 flex flex-col justify-center border-r border-white/10 shrink-0 overflow-y-auto"
        style={{ width: "450px" }}
      >

        <div className="max-w-sm w-full mx-auto">

          {/* LOGO + HEADING */}
          <div className="mb-6 space-y-4">

            <div className="flex justify-start">
              <Logo /> {/* 👈 HERE */}
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                Sign in to continue
              </p>
            </div>

          </div>

          {/* TOGGLE */}
          <div className="flex gap-2 p-1 bg-white/10 rounded-lg mb-5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${
                mode === "email"
                  ? "bg-white text-[#030f36]"
                  : "text-blue-200 hover:bg-white/10"
              }`}
            >
              <FiMail size={16} />
              Email
            </button>

            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${
                mode === "phone"
                  ? "bg-white text-[#030f36]"
                  : "text-blue-200 hover:bg-white/10"
              }`}
            >
              <FiPhone size={16} />
              Phone
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-300 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                {mode === "email" ? <FiMail /> : <FiPhone />}
              </span>

              <input
                type={mode === "email" ? "email" : "tel"}
                name={mode === "email" ? "email" : "phone"}
                placeholder={mode === "email" ? "Email" : "Phone number"}
                value={mode === "email" ? form.email : form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <FiLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full py-2.5 rounded-md font-medium bg-white text-[#030f36] hover:bg-blue-100"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-blue-200">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex flex-1 h-full items-center justify-center bg-[#f3ede4]">
        <Image
          src="/Mascot_looping.gif"
          alt="Login Mascot"
          width={500}
          height={500}
          className="w-full h-auto object-contain"
          style={{ maxWidth: "500px" }}
          priority
          unoptimized
        />
      </div>

    </div>
  );
}