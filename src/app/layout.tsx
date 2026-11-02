import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Inter + an italic serif accent line reproduces the reference's two-voice headings.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "GBR Hatcheries Pvt Ltd — From a single egg to every table",
  description:
    "GBR Hatcheries is an integrated Indian poultry company: breeder farms, hatchery, feed farm, partner farmer support and fresh retail.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
