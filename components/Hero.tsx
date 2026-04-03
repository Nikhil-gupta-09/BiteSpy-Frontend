export default function Hero() {
  return (
    <section
      className="min-h-screen px-16 pt-32 pb-20 
      grid lg:grid-cols-2 gap-16 items-center text-white"
    >

      {/* LEFT CONTENT */}
      <div>

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

      {/* RIGHT VISUAL */}
      <div className="relative flex justify-center">

        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
        />

      </div>
    </section>
  );
}