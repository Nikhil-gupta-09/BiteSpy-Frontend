import "./globals.css";
import { DM_Sans } from "next/font/google";
import DynamicBackground from "@/components/DynamicBackground";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen font-sans antialiased text-white overflow-x-hidden bg-black">
        
        {/* 🔥 3JS BACKGROUND */}
        <DynamicBackground />

        {/* CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}