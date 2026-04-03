"use client";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen px-16 pt-32 pb-20 
      grid lg:grid-cols-2 gap-16 items-center text-white overflow-hidden"
    >
      {/* BACKGROUND IMAGE & OVERLAY (Faded at the bottom) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", 
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" 
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home_bkg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4c1d95]/95 via-[#4c1d95]/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* LEFT CONTENT */}
      <div className="z-10 relative">

        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight mb-6">
          Expose the truth
          <br />
          behind your food.
        </h1>

        <p className="text-blue-200 mb-8 max-w-xl text-lg">
          BiteSpy uses AI to uncover hidden ingredients, fake health claims,
          and misleading labels — giving you a clear, honest breakdown of
          what you're really consuming.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4">

          {/* PRIMARY BUTTON */}
          <button
            onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-lg font-medium 
            bg-[#f1f5f9] text-[#030f36]
            hover:bg-[#e2e8f0] 
            shadow-lg shadow-black/20
            hover:scale-[1.05] active:scale-[0.95] transition"
          >
            Scan a Product
          </button>

          {/* SECONDARY BUTTON */}
          <button
            className="px-6 py-3 rounded-lg 
            bg-white/10 border border-white/20 
            text-blue-100 
            hover:bg-white/20 
            transition"
          >
            See How It Works
          </button>

        </div>
      </div>

      {/* RIGHT VISUAL (Empty for now) */}
      <div className="relative flex justify-center z-10">

      </div>
    </section>
  );
}