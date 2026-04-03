export default function ClaimForm() {
  return (
    <section className="px-16 pb-24">
      <div className="bg-white rounded-3xl p-12 shadow-sm">
        <h2 className="text-2xl font-semibold text-center">
          Start your claim check
        </h2>

        <p className="text-gray-500 text-center mt-2 mb-10">
          Upload product information for instant AI analysis
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <label className="text-sm">Product Name</label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="e.g High Protein Yogurt"
            />

            <label className="text-sm mt-6 block">Ingredients</label>

            <textarea
              className="w-full border rounded-lg p-3 mt-2 h-32"
              placeholder="Paste ingredient list..."
            />

            <button className="bg-emerald-900 text-white px-6 py-3 rounded-lg mt-6 w-full">
              Run Analysis
            </button>
          </div>

          <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12">
            <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              ↑
            </div>

            <p className="font-medium">Label Image</p>

            <p className="text-sm text-gray-500">
              Upload ingredient label photo
            </p>

            <button className="mt-4 border px-4 py-2 rounded-lg text-sm">
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
