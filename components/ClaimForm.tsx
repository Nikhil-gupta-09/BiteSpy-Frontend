"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function ClaimForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
  };

  const goToQuestions = () => {
    router.push("/questions?product=nutella");
  };

  return (
    <section
      id="upload-section"
      className="
      relative px-6 md:px-12 py-32
      flex justify-center items-center min-h-screen
      overflow-hidden
    "
    >
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-[1300px]">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-5xl font-extrabold tracking-tight text-white">
            Know what is really inside your food
          </h2>
          <p className="text-slate-200 mt-4 text-lg">
            Upload once, answer 5 quick yes/no questions, get your truth score.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-24 items-center">
          <div className="relative group flex flex-col gap-12">
            <div
              className="
              absolute inset-0 rounded-[2.5rem]
              bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30
              blur-xl opacity-70
              group-hover:opacity-100 transition
            "
            />

            <div className="relative">
              <div className="skew-x-[-12deg]">
                <div
                  className="
                  skew-x-[12deg]
                  flex flex-col items-center justify-center
                  px-10 py-14 text-center
                  border border-dashed border-white/20
                  rounded-[2rem]
                  bg-slate-900/60 backdrop-blur-xl shadow-2xl
                  hover:border-emerald-400/50
                  transition-all duration-300
                  cursor-pointer
                "
                  onClick={handleUploadClick}
                >
                  <div
                    className="
                    w-20 h-20 rounded-2xl
                    bg-gradient-to-br from-emerald-400 to-cyan-500
                    text-white
                    flex items-center justify-center mb-6
                    shadow-[0_0_30px_rgba(16,185,129,0.4)]
                    group-hover:-translate-y-2
                    transition
                  "
                  >
                    <FiUploadCloud size={36} />
                  </div>

                  <p className="text-xl font-semibold text-white">Upload product label</p>
                  <p className="text-sm text-slate-300 mt-2">
                    Hardcoded demo product: Nutella jar front label
                  </p>

                  <button
                    className="
                    mt-6 px-6 py-2 rounded-lg font-medium
                    bg-white/10 text-white
                    hover:bg-white/20
                    transition
                  "
                    type="button"
                    onClick={handleUploadClick}
                  >
                    Browse Files
                  </button>

                  {fileName ? (
                    <p className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                      Uploaded: {fileName}
                    </p>
                  ) : null}

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <button
              className="
              w-full py-5 rounded-2xl font-semibold text-lg
              bg-[#0f172a] text-white border border-white/10
              hover:bg-[#1e293b]
              transition-all duration-200
              disabled:cursor-not-allowed disabled:opacity-60
            "
              type="button"
              onClick={goToQuestions}
              disabled={!fileName}
            >
              {fileName ? "Start BiteSpy Questions" : "Upload first to continue"}
            </button>
          </div>

          <div className="relative flex justify-center items-center">
            <div
              className="
              absolute w-[450px] h-[450px]
              bg-gradient-to-r from-blue-500/20 to-cyan-500/20
              rounded-full blur-3xl
            "
            />

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
