"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import type { ScanResult } from "@/lib/claim-analysis";
import { PROFILE_EMAIL_STORAGE_KEY } from "@/lib/profile";

interface SearchHistoryItem {
  id: string;
  scanId: string;
  productName: string;
  claimOMeter: number;
  verdict: string;
  source: "image" | "name" | "unknown";
  createdAt: string;
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      if (!value) {
        reject(new Error("Could not read file data."));
        return;
      }
      resolve(value);
    };
    reader.onerror = () => reject(new Error("Failed to read selected image."));
    reader.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file: File): Promise<{ secureUrl: string; publicId: string } | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "bitespy");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary upload failed: ${message}`);
  }

  const payload = (await response.json()) as { secure_url?: string; public_id?: string };

  if (!payload.secure_url || !payload.public_id) {
    throw new Error("Cloudinary did not return a usable image URL.");
  }

  return { secureUrl: payload.secure_url, publicId: payload.public_id };
}

export default function ClaimForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [typedProductName, setTypedProductName] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [detectedProduct, setDetectedProduct] = useState("");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const email = localStorage.getItem(PROFILE_EMAIL_STORAGE_KEY) || "";
    if (!email.trim()) {
      setHistory([]);
      return;
    }

    let active = true;

    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await fetch(`/api/history?email=${encodeURIComponent(email)}&limit=8`);
        const payload = (await response.json()) as { history?: SearchHistoryItem[] };
        if (!response.ok) {
          throw new Error("Could not load search history.");
        }

        if (active) {
          setHistory(Array.isArray(payload.history) ? payload.history : []);
        }
      } catch {
        if (active) {
          setHistory([]);
        }
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    };

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setCloudinaryUrl("");
    setScanError("");
    setDetectedProduct("");

    setIsPreparingImage(true);
    void toDataUrl(file)
      .then(async (value) => {
        setImageDataUrl(value);
        await scanFromUploadedFile(file, value);
      })
      .catch((error) => {
        setImageDataUrl("");
        setScanError(error instanceof Error ? error.message : "Failed to prepare uploaded image.");
      })
      .finally(() => {
        setIsPreparingImage(false);
      });

    event.target.value = "";
  };

  const startScan = async (body: {
    imageDataUrl?: string;
    productName?: string;
    cloudinaryUrl?: string;
    cloudinaryPublicId?: string;
  }) => {
    setIsScanning(true);
    setScanError("");

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as ScanResult | { error?: string; message?: string };

      if (!response.ok || !("scanId" in payload)) {
        const errMessage =
          "error" in payload && (payload.message || payload.error)
            ? payload.message || payload.error || "Could not analyze this product."
            : "Could not analyze this product.";
        setScanError(errMessage);
        return;
      }

      const scan = payload;
      setDetectedProduct(scan.productName);
      sessionStorage.setItem(`bitespy:scan:${scan.scanId}`, JSON.stringify(scan));
      sessionStorage.setItem("bitespy:lastScanId", scan.scanId);
      sessionStorage.setItem("bitespy:lastScanSource", body.imageDataUrl ? "image" : "name");
      router.push(`/questions?scanId=${encodeURIComponent(scan.scanId)}`);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const scanFromUploadedFile = async (file: File, payloadImage: string) => {
    if (isScanning) {
      return;
    }

    try {
      try {
        const cloudinaryAsset = await uploadToCloudinary(file);

        if (cloudinaryAsset) {
          setCloudinaryUrl(cloudinaryAsset.secureUrl);
          sessionStorage.setItem("bitespy:lastCloudinaryUrl", cloudinaryAsset.secureUrl);
          await startScan({
            imageDataUrl: payloadImage,
            cloudinaryUrl: cloudinaryAsset.secureUrl,
            cloudinaryPublicId: cloudinaryAsset.publicId,
          });
          return;
        }
      } catch (cloudinaryError) {
        console.warn(cloudinaryError);
      }

      await startScan({ imageDataUrl: payloadImage });
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Scan failed. Please try again.");
    }
  };

  const goToQuestionsByName = async () => {
    const productName = typedProductName.trim();
    if (!productName || isScanning) {
      return;
    }

    await startScan({ productName });
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
      <div className="absolute w-[500px] h-[500px] bg-blue-600/12 blur-[130px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-sky-500/10 blur-[130px] bottom-[-100px] right-[-100px]" />

      <div className="relative w-full max-w-[1300px]">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-5xl font-extrabold tracking-tight text-white">
            Know what is really inside your food
          </h2>
          <p className="text-blue-100/70 mt-4 text-lg">
            Upload once, answer 5 quick yes/no questions, get your truth score.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-24 items-center">
          <div className="relative group flex flex-col gap-12">
            <div
              className="
              absolute inset-0 rounded-[2.5rem]
              bg-gradient-to-r from-blue-600/25 via-sky-500/25 to-cyan-500/25
              blur-lg opacity-40
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
                  bg-[#0D1F40]/70 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.25)]
                  hover:border-blue-400/40
                  transition-all duration-300
                  cursor-pointer
                "
                  onClick={handleUploadClick}
                >
                  <div
                    className="
                    w-20 h-20 rounded-2xl
                    bg-gradient-to-br from-blue-500 to-sky-500
                    text-white
                    flex items-center justify-center mb-6
                    shadow-[0_0_18px_rgba(59,130,246,0.30)]
                    group-hover:-translate-y-2
                    transition
                  "
                  >
                    <FiUploadCloud size={36} />
                  </div>

                  <p className="text-xl font-semibold text-white">Upload product label</p>
                  <p className="text-sm text-blue-100/70 mt-2">
                    Gemini will detect product, ingredients, and likely claim labels.
                  </p>

                  <button
                    className="
                    mt-6 px-6 py-2 rounded-lg font-medium
                    bg-white/10 text-white
                    hover:bg-white/20
                    transition
                  "
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUploadClick();
                    }}
                  >
                    Browse Files
                  </button>

                  {fileName ? (
                    <p className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                      Uploaded: {fileName}
                    </p>
                  ) : null}

                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Uploaded product"
                      width={240}
                      height={240}
                      className="mt-4 h-40 w-40 rounded-xl border border-white/20 object-cover"
                      unoptimized
                    />
                  ) : null}

                  {isPreparingImage ? (
                    <p className="mt-3 rounded-lg border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
                      Preparing image...
                    </p>
                  ) : null}

                  {detectedProduct ? (
                    <p className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                      Detected: {detectedProduct}
                    </p>
                  ) : null}

                  {cloudinaryUrl ? (
                    <a
                      href={cloudinaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block rounded-lg border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 underline decoration-sky-200/70 underline-offset-4"
                    >
                      Stored on Cloudinary
                    </a>
                  ) : null}

                  {scanError ? (
                    <p className="mt-3 rounded-lg border border-red-300/30 bg-red-400/10 px-4 py-2 text-sm text-red-100">
                      {scanError}
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

            <p className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-cyan-100">
              Uploading an image now auto-starts the scan and takes you to the next step.
            </p>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold tracking-[0.08em] text-cyan-100">OR TYPE PRODUCT NAME</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={typedProductName}
                  onChange={(event) => setTypedProductName(event.target.value)}
                  placeholder="e.g. Nutella, Maggi Noodles, Oreo"
                  className="w-full rounded-xl border border-white/15 bg-[#0a1e42] px-4 py-3 text-white outline-none placeholder:text-blue-300/50 focus:border-blue-400/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={goToQuestionsByName}
                  disabled={!typedProductName.trim() || isScanning}
                  className="rounded-xl border border-blue-400/30 bg-blue-500/15 px-5 py-3 font-semibold text-white transition hover:bg-blue-400/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isScanning ? "Analyzing..." : "Use name"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold tracking-[0.08em] text-sky-300">YOUR RECENT SEARCH HISTORY</p>

              {historyLoading ? <p className="mt-3 text-sm text-blue-100">Loading history...</p> : null}

              {!historyLoading && !history.length ? (
                <p className="mt-3 text-sm text-blue-100">
                  No history yet. Login and complete a scan to store searchable history.
                </p>
              ) : null}

              <div className="mt-3 space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => router.push(`/result?historyId=${encodeURIComponent(item.id)}`)}
                    className="w-full rounded-xl border border-white/12 bg-[#0a1e42] px-4 py-3 text-left transition hover:border-blue-400/35 hover:bg-[#0d2258]"
                  >
                    <p className="text-sm font-semibold text-white">{item.productName}</p>
                    <p className="mt-1 text-xs text-sky-300/80">
                      Score {item.claimOMeter}/10 · {item.verdict} · {item.source === "image" ? "Image scan" : "Typed search"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
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
                drop-shadow-[0_18px_45px_rgba(0,0,0,0.35)]
                hover:-translate-y-4 transition duration-500
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
