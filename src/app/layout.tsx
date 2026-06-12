import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/useSession";
import { PhoneFrame } from "@/components/shell/PhoneFrame";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renew Home — Cheaper times. Cleaner times. No effort.",
  description:
    "Renew Home connects your smart thermostat to the power grid and shifts energy use toward the cheapest, cleanest moments of the day. Save ~$100/yr, cut CO₂, stay in full control. (Simulated prototype.)",
};

export const viewport: Viewport = {
  themeColor: "#0b3b2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SessionProvider>
          <PhoneFrame>{children}</PhoneFrame>
        </SessionProvider>
      </body>
    </html>
  );
}
