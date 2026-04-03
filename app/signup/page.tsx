"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";

import { FiEye, FiEyeOff } from "react-icons/fi";

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

  // 🔄 phone → email (firebase workaround)
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
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <Image src="/hero.png" alt="Hero" width={500} height={500} />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 border rounded-2xl shadow-md">

          <h2 className="text-2xl font-semibold text-center mb-4">
            Create Account
          </h2>

          {/* SLIDER */}
          <div className="relative flex bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-1/2 h-full bg-black transition-transform ${
                mode === "phone" ? "translate-x-full" : ""
              }`}
            />

            <button
              type="button"
              onClick={() => setMode("email")}
              className="w-1/2 py-2 z-10 text-white text-sm font-medium"
            >
              Email
            </button>

            <button
              type="button"
              onClick={() => setMode("phone")}
              className="w-1/2 py-2 z-10 text-white text-sm font-medium"
            >
              Phone
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            {/* EMAIL / PHONE */}
            {mode === "email" ? (
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            ) : (
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            )}

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}