"use client";
import hero1 from "@/public/hero1.png"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FiSearch, FiZap, FiShield } from "react-icons/fi";

export default function InsightsPage() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-white"
    >
      <Navbar />

      {/* TOP HEADER SECTION WITH WAVY BOTTOM */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-gradient-to-r from-sky-600 via-blue-600 to-blue-800">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-sm">
            Bite Spy Insight
          </h1>
          <p className="text-indigo-200 text-sm font-medium tracking-wide">
            Home <span className="mx-3 opacity-60">»</span> Bite Spy Insight
          </p>
        </div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-24 left-32 text-white/30 text-xl font-bold rotate-45">▲</div>
        <div className="absolute bottom-28 right-40 text-white/40 text-5xl font-bold">+</div>
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-white/30 rounded-full" />

        {/* Multi-Layered Wavy SVG Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[150px] md:h-[200px]" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" fillOpacity="0.2" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#ffffff" fillOpacity="0.5" d="M0,224L48,229.3C96,235,192,245,288,229.3C384,213,480,171,576,149.3C672,128,768,128,864,154.7C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#ffffff" d="M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,234.7C672,213,768,139,864,122.7C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6 md:px-12 bg-white text-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          
          {/* LEFT: Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#1e293b]">
              What is <span className="text-[#0ea5e9]">BiteSpy?</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              BiteSpy gives every packaged food a simple, AI based rating from 0 to 5, so you can quickly understand exactly what you are putting in your body without decoding complex ingredient lists.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Unlike flashy front-of-pack marketing claims, the Bite Spy System looks deeper—evaluating a product's actual nutritional profile, identifying hidden sugars, and exposing misleading labels. It's time to choose better.
            </p>
          </div>

          {/* RIGHT: Mockup */}
          <div className="relative flex justify-center py-4">
            {/* Added decorative circles behind the mockup like in the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-100 rounded-full blur-3xl -z-10" />
            
            {/* Floating Info Boxes (Like TruthIn rating boxes) */}
            <div className="absolute top-1/4 -left-10 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100 z-20 animate-float hidden md:block" style={{ animationDelay: '1s' }}>
               <div className="text-[#0ea5e9] font-bold text-lg mb-1">Clean Label</div>
               <div className="text-xs text-slate-500 font-medium">Verified by AI</div>
            </div>
            
              <div className="absolute bottom-1/4 -right-10 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100 z-20 animate-float hidden md:block" style={{ animationDelay: '2s' }}>
               <div className="text-[#0ea5e9] font-bold text-lg mb-1">Score: 4.8/5</div>
               <div className="text-xs text-slate-500 font-medium">Excellent match</div>
            </div>

            <img 
              src={hero1.src}
              alt="Bite Spy Insight System Mockup" 
              className="w-full max-w-sm rounded-xl drop-shadow-2xl z-10"
            />
          </div>

        </div>
      </section>

      {/* HOW DOES THE SYSTEM WORK SECTION */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#030f36] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-20 text-center text-white drop-shadow-sm">
            How does the system work?
          </h2>

          <div className="relative border-l-4 border-sky-200 ml-4 md:ml-0 md:border-none">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-sky-100 -translate-x-1/2"></div>
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-16 md:flex justify-between items-center w-full"
            >
              <div className="hidden md:flex w-5/12 justify-end pr-12 items-center">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  src="/insight_click.png" 
                  alt="Upload Click Insight" 
                  className="w-full max-w-[280px] object-contain rounded-xl drop-shadow-xl"
                />
              </div>
              <div className="absolute left-[-12px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-sky-500 rounded-full border-4 border-white shadow-md"></div>
              <div className="ml-8 md:ml-0 md:w-5/12 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">Step 1</div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Upload & AI Extraction</h3>
                <div className="p-3 mb-4 bg-green-50 rounded-xl border border-green-100 font-medium text-sm text-green-800 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                  User clicks an image and uploads on the app
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-sm text-amber-800 space-y-3">
                  <p><strong>AI processing begins:</strong></p>
                  <ul className="list-disc ml-5 space-y-1 text-amber-700/90">
                    <li>Aims to fetch claims from the front label of a product + marketing tagline.</li>
                    <li>Aims to fetch the ingredients and nutrient data of the product.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-16 md:flex justify-between items-center w-full flex-row-reverse"
            >
              <div className="hidden md:flex w-5/12 justify-start pl-12 items-center">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  src="/insight_search.png" 
                  alt="Search Verification Insight" 
                  className="w-full max-w-[280px] object-contain rounded-xl drop-shadow-xl"
                />
              </div>
              <div className="absolute left-[-12px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md"></div>
              <div className="ml-8 md:ml-0 md:w-5/12 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Step 2</div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Cross-Verification</h3>
                <div className="p-3 bg-green-50 rounded-xl border border-green-100 font-medium text-sm text-green-800 flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                  Verify the claims based on the ingredients & labels using LLM mapping.
                </div>
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-sm text-amber-800 space-y-3">
                  <p><strong>AI processing begins:</strong></p>
                  <ul className="list-disc ml-5 space-y-1 text-amber-700/90">
                    <li></li>
                    <li>Aims to fetch the ingredients and nutrient data of the product.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-16 md:flex justify-between items-center w-full"
            >
              <div className="hidden md:flex w-5/12 justify-end pr-12 items-center">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  src="/insight_write.png" 
                  alt="Write Profile Insight" 
                  className="w-full max-w-[280px] object-contain rounded-xl drop-shadow-xl"
                />
              </div>
              <div className="absolute left-[-12px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-cyan-500 rounded-full border-4 border-white shadow-md"></div>
              <div className="ml-8 md:ml-0 md:w-5/12 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Step 3</div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Personalized Q&A</h3>
                <div className="p-3 mb-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                  <div className="flex items-center gap-3 font-medium mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                    Ask questions based on user profile:
                  </div>
                  <ul className="text-green-700 ml-8 list-disc space-y-1">
                    <li>Medical Condition</li>
                    <li>Allergies</li>
                    <li>Diet Preferences</li>
                    <li>Specific claims to verify</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-sm text-amber-800">
                  <p><strong>AI Action:</strong> Aims to generate questions for the user based on the product ingredients.</p>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative md:flex justify-between items-center w-full flex-row-reverse"
            >
              <div className="hidden md:flex w-5/12 justify-start pl-12 items-center">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  src="/insight_result.png" 
                  alt="Result Insight" 
                  className="w-full max-w-[280px] object-contain rounded-xl drop-shadow-xl"
                />
              </div>
              <div className="absolute left-[-12px] md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-sky-600 rounded-full border-4 border-white shadow-md"></div>
              <div className="ml-8 md:ml-0 md:w-5/12 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">Step 4</div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Final Conclusion & Rating</h3>
                <div className="p-3 mb-4 bg-green-50 rounded-xl border border-green-100 font-medium text-sm text-green-800 flex items-start gap-3">
                   <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                   Table for valid, misleading, false claims & providing Rating (Claim-O-Meter) with alternatives.
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-sm text-amber-800">
                  <p><strong>AI Action:</strong> Aims to make a final conclusion based on overall data.</p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* WHY USE OUR PLATFORM SECTION */}
      <section className="py-24 px-6 md:px-12 bg-white text-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-5 text-[#1e293b]">
            Why use our platform?
          </h2>
          <p className="mx-auto mb-16 max-w-3xl text-lg leading-relaxed text-slate-600">
            Because a useful food score should explain itself. We do not just
            label products as good or bad; we break down the signals behind the
            rating so you can see what changed the verdict and why it matters.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiSearch />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Ingredient Risk Signals
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We scan the label for added sugars, emulsifiers, preservatives,
                artificial colors, and other ingredients that are easy to miss
                when the front of the pack is trying to look healthy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiZap />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Claim vs Evidence
              </h3>
              <p className="text-slate-600 leading-relaxed">
                The platform compares marketing claims with the ingredient list
                and nutrition panel, so a product claiming to be light, clean, or
                healthy gets tested against the actual data.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiShield />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Personal Health Context
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Allergies, conditions, and diet preferences can turn a neutral
                product into a bad fit. That context helps us move from a generic
                score to a recommendation that is actually relevant.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-left shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              What the score is really telling you
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              A lower score usually means the label contains more processed
              signals, weaker transparency, or a bigger mismatch between the
              product's claims and its actual ingredients. The goal is not
              alarmism. It is faster, clearer food decisions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </motion.main>
  );
}
