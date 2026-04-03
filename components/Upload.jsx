export default function UploadCard() {
  return (
    <div className="bg-white border rounded-2xl shadow-md p-8 w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-2">Start your claim check</h3>

      <p className="text-sm text-neutral-500 mb-6">
        Upload a product label or ingredient list
      </p>

      {/* main action */}
      <label
        className="flex items-center justify-between
        border rounded-xl px-5 py-4 cursor-pointer
        hover:bg-neutral-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
            ↑
          </div>

          <div>
            <p className="font-medium">Upload image</p>

            <p className="text-sm text-neutral-500">JPG, PNG up to 10MB</p>
          </div>
        </div>

        <div className="text-sm border px-3 py-1 rounded-lg">Browse</div>

        <input type="file" className="hidden" />
      </label>

      {/* divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-neutral-200 flex-1" />

        <span className="text-xs text-neutral-400">OR</span>

        <div className="h-px bg-neutral-200 flex-1" />
      </div>

      {/* alternatives */}
      <div className="grid grid-cols-3 gap-3">
        <button className="border rounded-lg py-2 text-sm hover:bg-neutral-50">
          Ingredients
        </button>

        <button className="border rounded-lg py-2 text-sm hover:bg-neutral-50">
          Label Image
        </button>

        <button className="border rounded-lg py-2 text-sm hover:bg-neutral-50">
          Product Name
        </button>
      </div>
    </div>
  );
}
