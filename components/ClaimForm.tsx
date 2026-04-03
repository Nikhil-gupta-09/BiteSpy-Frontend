import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";

export default function ClaimForm() {
  return (
    <section className="
      relative px-6 md:px-12 py-32 
      flex justify-center items-center min-h-screen 
      overflow-hidden
    ">

      {/* BACKGROUND GLOWS */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* MAIN WRAPPER */}
      <div className="relative w-full max-w-[1300px]">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-5xl font-extrabold tracking-tight text-white">
            Know what’s really inside your food
          </h2>
          <p className="text-slate-300 mt-4 text-lg">
            Simple, clear insights to help you make better choices
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-24 items-center">

          {/* LEFT */}
          <div className="relative group flex flex-col gap-12">

            {/* GLOW RING */}
            <div className="
              absolute inset-0 rounded-[2.5rem]
              bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20
              blur-xl opacity-70
              group-hover:opacity-100 transition
            " />

            {/* 🔺 SKEWED DROP ZONE */}
            <div className="relative">

              <div className="skew-x-[-12deg]">

                <div className="
                  skew-x-[12deg]
                  flex flex-col items-center justify-center 
                  px-10 py-14 text-center
                  border border-dashed border-white/20
                  rounded-[2rem]
                  bg-transparent
                  hover:border-blue-400/50
                  transition-all duration-300
                  cursor-pointer
                ">

                  {/* ICON */}
                  <div className="
                    w-20 h-20 rounded-2xl 
                    bg-gradient-to-br from-blue-500 to-indigo-500
                    text-white
                    flex items-center justify-center mb-6
                    shadow-lg
                    group-hover:-translate-y-2
                    transition
                  ">
                    <FiUploadCloud size={36} />
                  </div>

                  {/* TEXT */}
                  <p className="text-xl font-semibold text-white">
                    Upload product label
                  </p>

                  <p className="text-sm text-slate-400 mt-2">
                    We’ll break it down into simple, understandable insights
                  </p>

                  {/* BUTTON */}
                  <button className="
                    mt-6 px-6 py-2 rounded-lg font-medium
                    bg-white/10 text-white
                    hover:bg-white/20
                    transition
                  ">
                    Browse Files
                  </button>

                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="
              w-full py-5 rounded-2xl font-semibold text-lg
              bg-[#0f172a] text-white border border-white/10
              hover:bg-[#1e293b]
              transition-all duration-200
            ">
              Check this product
            </button>

          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center">

            {/* HALO */}
            <div className="
              absolute w-[450px] h-[450px]
              bg-gradient-to-r from-blue-500/20 to-purple-500/20
              rounded-full blur-3xl
            " />

            <Image
              src="/hero2.png"
              alt="Product insight illustration"
              width={520}
              height={520}
              className="
                object-contain relative z-10
                drop-shadow-[0_30px_80px_rgba(0,0,0,0.6)]
                hover:-translate-y-4 transition duration-500
              "
            />

          </div>

        </div>
      </div>
    </section>
  );
}