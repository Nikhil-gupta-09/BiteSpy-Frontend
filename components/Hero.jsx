export default function Hero() {
  return (
    <section className="px-16 py-20 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="text-xs bg-gray-200 inline-block px-3 py-1 rounded-full mb-6">
          CLINICAL GRADE ANALYSIS
        </div>

        <h1 className="text-6xl font-semibold leading-tight mb-6">
          Know the truth
          <br />
          behind every bite.
        </h1>

        <p className="text-gray-600 mb-8 max-w-xl">
          Unmask hidden additives, verify nutritional claims, and regain control
          over your metabolic health using advanced AI-driven bio-editorial food
          insights.
        </p>

        <div className="flex gap-4">
          <button className="bg-emerald-900 text-white px-6 py-3 rounded-lg">
            Analyze Now
          </button>

          <button className="bg-gray-200 px-6 py-3 rounded-lg">
            View Case Studies
          </button>
        </div>
      </div>

      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          className="rounded-3xl"
        />

        <div className="absolute bottom-5 left-5 bg-white rounded-xl shadow px-6 py-4 w-72">
          <p className="text-xs text-gray-500">ACTIVE SCAN</p>

          <div className="flex justify-between items-center mt-1">
            <span className="text-sm">Organic Almond Milk</span>

            <span className="font-semibold">94/100</span>
          </div>

          <div className="h-1 bg-gray-200 mt-2 rounded">
            <div className="bg-emerald-900 h-1 w-[94%] rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
