"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";

import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiPhone,
  FiLock,
  FiUser,
} from "react-icons/fi";

type Mode = "email" | "phone";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("email");

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
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
        mode === "email"
          ? form.email
          : normalizePhoneToEmail(form.phone);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailToUse,
        form.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-6">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex justify-center items-center">
          <Image
            src="/Mascot_looping.gif"
            alt="Login Mascot"
            width={420}
            height={420}
            className="drop-shadow-2xl object-contain"
            priority
            unoptimized
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full max-w-sm mx-auto">

          {/* HEADING */}
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-white">
              Create account
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              Join and get started
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex gap-2 p-1 bg-white/10 rounded-lg mb-5">

            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${
                mode === "email"
                  ? "bg-[#f1f5f9] text-[#030f36]"
                  : "text-blue-200 hover:bg-white/10"
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
                  ? "bg-[#f1f5f9] text-[#030f36]"
                  : "text-blue-200 hover:bg-white/10"
              }`}
            >
              <FiPhone size={16} />
              Phone
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FIRST NAME */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <FiUser />
              </span>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* LAST NAME */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <FiUser />
              </span>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* EMAIL / PHONE */}
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
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* PASSWORD */}
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
                className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-md text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            {/* SIGNUP BUTTON */}
            <button
              disabled={loading}
              className="w-full py-2.5 rounded-md font-medium 
              bg-[#f1f5f9] text-[#030f36]
              hover:bg-[#e2e8f0] 
              shadow-lg shadow-black/20
              transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>

            {/* LOGIN */}
            <Link
              href="/login"
              className="block text-center text-blue-200 hover:text-white text-xs mt-2"
            >
              Already have an account? Login
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
}