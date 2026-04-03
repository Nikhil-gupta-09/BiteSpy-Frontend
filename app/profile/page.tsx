"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Mars,
  Venus,
} from "lucide-react";

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    conditions: [] as string[],
    diet: "",
    goal: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCondition = (condition: string) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const inputStyle =
    "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const circleBtn =
    "w-12 h-12 rounded-full flex items-center justify-center bg-white text-[#030f36] hover:scale-110 transition shadow-md";

  const stepVariants = {
    hidden: (dir: number) => ({
      x: dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25 },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* LEFT */}
      <div className="w-full md:w-[520px] h-full px-8 py-10 flex flex-col justify-center border-r border-white/10">

        <div className="max-w-md w-full mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white">
              Build your profile
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              Step {step} of 3
            </p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <input name="fullName" placeholder="Full name" onChange={handleChange} className={inputStyle} />

                <div className="grid grid-cols-2 gap-4">
                  <input name="age" placeholder="Age" onChange={handleChange} className={inputStyle} />
                  <input name="height" placeholder="Height (cm)" onChange={handleChange} className={inputStyle} />
                </div>

                <input name="weight" placeholder="Weight (kg)" onChange={handleChange} className={inputStyle} />

                {/* GENDER */}
                <div className="flex justify-center gap-6 pt-4">
                  {[
                    { label: "Male", icon: Mars, color: "text-blue-400" },
                    { label: "Female", icon: Venus, color: "text-pink-400" },
                  ].map((g) => {
                    const Icon = g.icon;
                    const selected = form.gender === g.label;

                    return (
                      <button
                        key={g.label}
                        onClick={() => setForm({ ...form, gender: g.label })}
                        className={`flex flex-col items-center gap-2 ${
                          selected ? "scale-110" : "opacity-70"
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                          selected ? "bg-white text-[#030f36]" : "bg-white/10"
                        }`}>
                          <Icon size={24} className={selected ? "" : g.color} />
                        </div>
                        <span className="text-sm text-white">{g.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* NEXT */}
                <div className="flex justify-end pt-4">
                  <button onClick={nextStep} className={circleBtn}>
                    <ChevronRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {[
                  "Diabetes",
                  "Hypertension",
                  "Cholesterol",
                  "Heart",
                  "Thyroid",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    className={`w-full text-left px-4 py-3 rounded-lg ${
                      form.conditions.includes(c)
                        ? "bg-white text-[#030f36]"
                        : "bg-white/10 text-blue-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}

                {/* NAV */}
                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className={circleBtn}>
                    <ChevronLeft />
                  </button>
                  <button onClick={nextStep} className={circleBtn}>
                    <ChevronRight />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-3">
                  {["Vegetarian","Eggetarian","Non-Veg","Vegan"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm({ ...form, diet: d })}
                      className={`p-3 rounded-lg ${
                        form.diet === d ? "bg-white text-[#030f36]" : "bg-white/10 text-blue-200"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["Weight Loss","Weight Gain","Maintain","Muscle"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm({ ...form, goal: g })}
                      className={`p-3 rounded-lg ${
                        form.goal === g ? "bg-white text-[#030f36]" : "bg-white/10 text-blue-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* NAV */}
                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className={circleBtn}>
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={() => console.log(form)}
                    className="px-6 py-2 rounded-full bg-white text-[#030f36] font-medium"
                  >
                    Finish
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex flex-1 h-full bg-white items-center justify-center">
        <Image src="/hero1.png" alt="Hero" width={500} height={500} />
      </div>

    </div>
  );
}