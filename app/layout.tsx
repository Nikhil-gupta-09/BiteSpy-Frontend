import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BiteSpy",
  description: "Know the truth behind every bite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="
        min-h-screen 
        bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#030f36]
        text-white
        ">
        {children}
      </body>
    </html>
  );
}