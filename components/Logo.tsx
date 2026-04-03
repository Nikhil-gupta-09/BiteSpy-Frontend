import Image from "next/image";
import mascot from "../public/logo_mascot.png";

export function Logo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Image 
        src={mascot} 
        alt="BiteSpy Mascot" 
        className="w-9 h-auto object-contain drop-shadow-md" 
        priority
      />
      <span className="text-white font-semibold text-lg tracking-tight">
        BiteSpy
      </span>
    </div>
  );
}