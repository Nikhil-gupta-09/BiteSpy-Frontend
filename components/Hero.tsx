export default function Hero() {
  return (
    <section
      className="min-h-screen px-16 pt-32 pb-20 
      bg-gradient-to-r from-[#020617] via-[#0b3c6f] to-[#007BFF] 
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

        <div className="flex gap-4">
          <button className="bg-gradient-to-r from-[#007BFF] to-[#00C6FF] 
          text-white px-6 py-3 rounded-lg font-medium 
          hover:scale-[1.05] active:scale-[0.95] transition">
            Scan a Product
          </button>

          <button className="bg-white/10 border border-white/20 
          px-6 py-3 rounded-lg text-blue-100 
          hover:bg-white/20 transition">
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

        {/* SCAN CARD */}
        <div className="absolute bottom-6 left-6 
        bg-white/10 backdrop-blur-md border border-white/20 
        rounded-xl px-5 py-4 w-72 shadow-xl">

          <p className="text-xs text-blue-200">🔍 LIVE ANALYSIS</p>

          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-white">
              Protein Bar
            </span>

            <span className="font-semibold text-white">
              62/100
            </span>
          </div>

          <div className="h-1 bg-white/20 mt-3 rounded">
            <div className="bg-gradient-to-r from-[#007BFF] to-[#00C6FF] h-1 w-[62%] rounded" />
          </div>

          <p className="text-xs text-blue-200 mt-2">
            ⚠️ Contains hidden sugars & additives
          </p>
        </div>
      </div>
    </section>
  );
}