import "./globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

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
    <html lang="en" className={dmSans.variable}>
      <body
        className="
          min-h-screen
          font-sans antialiased
          bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#030f36]
          text-white
        "
      >
        {children}
      </body>
    </html>
  );
}