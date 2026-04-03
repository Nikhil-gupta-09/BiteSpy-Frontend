import { FiUpload } from "react-icons/fi";

export default function UploadCard() {
  return (
    <div className="
      rounded-2xl 
      border border-white/10 
      bg-[#030f36]/40
      p-8 w-full max-w-lg text-white
    ">

      <h3 className="text-lg font-semibold mb-2">
        Start your claim check
      </h3>

      <p className="text-sm text-blue-200 mb-6">
        Upload a product label or ingredient list
      </p>

      {/* MAIN ACTION */}
      <label
        className="
        flex items-center justify-between
        border border-white/10 
        rounded-xl px-5 py-4 cursor-pointer
        hover:bg-white/5
        transition
      "
      >
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="
            w-10 h-10 rounded-lg 
            bg-[#f1f5f9] text-[#030f36] 
            flex items-center justify-center 
            shadow-md
          ">
            <FiUpload size={18} />
          </div>

          <div>
            <p className="font-medium text-white">
              Upload image
            </p>

            <p className="text-sm text-blue-200">
              JPG, PNG up to 10MB
            </p>
          </div>
        </div>

        {/* BROWSE BUTTON */}
        <div className="
          text-sm px-3 py-1 rounded-lg 
          bg-[#f1f5f9] text-[#030f36]
          hover:bg-[#e2e8f0] 
          transition
        ">
          Browse
        </div>

        <input type="file" className="hidden" />
      </label>

      {/* DIVIDER */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-blue-200">OR</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* ALTERNATIVES */}
      <div className="grid grid-cols-3 gap-3">

        <button className="
          border border-white/10 rounded-lg py-2 text-sm 
          hover:bg-white/5 
          text-blue-100 transition
        ">
          Ingredients
        </button>

        <button className="
          border border-white/10 rounded-lg py-2 text-sm 
          hover:bg-white/5 
          text-blue-100 transition
        ">
          Label Image
        </button>

        <button className="
          border border-white/10 rounded-lg py-2 text-sm 
          hover:bg-white/5 
          text-blue-100 transition
        ">
          Product Name
        </button>

      </div>
    </div>
  );
}