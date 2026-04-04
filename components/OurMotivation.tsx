"use client";

import { motion } from "framer-motion";
import { FiUsers, FiAlertTriangle, FiShield } from "react-icons/fi";

export default function OurMotivation() {
  return (
    <section className="py-24 px-6 md:px-12 w-full text-white relative flex justify-center items-center overflow-hidden bg-[#0b1d35]">
      {/* Background decorations */}
      <div className="absolute w-[500px] h-[500px] bg-sky-400/12 blur-[150px] rounded-full top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-300/12 blur-[120px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />

      <div className="max-w-[1300px] w-full relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl lg:text-6xl font-semibold leading-tight mb-8">
            Our{" "}
            <span
              className="
                italic font-serif 
                bg-gradient-to-r from-sky-200 via-cyan-100 to-blue-100 
                bg-clip-text text-transparent
                drop-shadow-[0_0_10px_rgba(96,165,250,0.35)]
              "
            >
              Motivation
            </span>
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-slate-200 leading-relaxed font-medium">
            <p>
              Harmful ingredients in consumable products like food and baby care items are linked to chronic diseases in children through various exposures. Children are especially vulnerable due to their developing bodies and higher relative intake.
            </p>
            <p>
              Artificial sweeteners, preservatives like sodium benzoate, and colorants such as tartrazine in processed foods can trigger asthma, allergies, and ADHD-like symptoms. Nitrates/nitrites in meats raise risks for methemoglobinemia and potential cancers.
            </p>
            
            <div className="p-6 md:p-8 mt-10 bg-white/8 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl relative">
              <p className="text-white text-xl leading-relaxed font-medium mb-6">
                "Because of false claims and misinformation, it is the public that suffers. Our aim is to build a community platform that helps people get closer to the truth."
              </p>
              <div className="flex items-center gap-3 text-cyan-200 font-bold uppercase tracking-widest text-sm">
                <FiUsers className="w-5 h-5" /> The BiteSpy Mission
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content / Visual representation */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Aesthetic glow behind the card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/18 to-blue-300/18 rounded-3xl blur-[80px] transform rotate-3 scale-110" />
          
          {/* Mockup News Card */}
          <div className="relative bg-white text-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 transform hover:-translate-y-2 transition duration-500">
            {/* Newspaper Header Styling */}
            <div className="py-6 px-8 border-b-4 border-slate-900 text-center bg-white relative">
               <h3 className="font-serif text-3xl font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                 THE TIMES OF INDIA
               </h3>
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            </div>

            <div className="p-8 md:p-10 bg-[#fdfdfd]">
              <div className="flex gap-4 items-center mb-6">
                 <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-sm shadow-sm tracking-wider">
                   Trending
                 </span>
                 <span className="text-red-600 font-bold text-sm tracking-wider uppercase border-b border-red-200">
                   Health Alert
                 </span>
              </div>

              <h4 className="text-3xl lg:text-[2.5rem] font-serif font-black text-slate-900 mb-8 leading-[1.15]">
                India Faces Global Safety Alert As WHO Warns Over 3 Toxic Cough Syrups After 19 Children Die In MP
              </h4>
              
              <div className="h-[2px] w-full bg-slate-200 mb-6" />

              <p className="text-slate-600 text-lg leading-relaxed font-serif italic border-l-4 border-slate-300 pl-5">
                Tragic incidents like these emphasize why blinded trust in commercial labels can be catastrophic. The need for transparent, verified ingredient checking has never been more urgent.
              </p>
            </div>
            
            {/* Bottom Accent */}
            <div className="w-full h-3 bg-gradient-to-r from-slate-800 to-slate-900" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
