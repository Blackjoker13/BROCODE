import "./globals.css";
import {
  Montserrat,
  Bodoni_Moda,
  Archivo_Black,
  JetBrains_Mono,
  UnifrakturCook,
} from "next/font/google";
import { getStorefrontData } from "@/lib/storefront/getStorefrontData";
import { PerformanceProvider } from "@/lib/performance/PerformanceContext";
import { StorefrontProvider } from "@/lib/storefront/StorefrontContext";
import BackgroundAudioPlayer from "@/components/audio/BackgroundAudioPlayer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-bodoni",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const unifrakturCook = UnifrakturCook({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-stay",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "BROCODE — Param Collection // Merch That Hits Different",
  description:
    "Luxury oversized streetwear. Brocode Param Collection live now. 3D interactive preview.",
  icons: {
    icon: "/icon 2.svg",
    shortcut: "/icon 2.svg",
    apple: "/icon 2.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  // Direct Server-Side Data Load
  const initialStorefrontData = await getStorefrontData();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${bodoniModa.variable} ${archivoBlack.variable} ${jetbrainsMono.variable} ${unifrakturCook.variable}`}
    >
      <body className="font-sans antialiased bg-[#EFEEE8] text-[#000000]">
        <PerformanceProvider>
          <StorefrontProvider initialData={initialStorefrontData}>
            {children}
            <BackgroundAudioPlayer />
          </StorefrontProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
