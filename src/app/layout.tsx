import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Grad Choice · Go8 Graduation Regalia in 3D",
  description:
    "Preview Australian Group of Eight graduation gowns, hoods, and caps in an interactive 3D studio. Eight universities, every colour sourced from official academic dress regulations.",
  openGraph: {
    title: "Grad Choice · Go8 Graduation Regalia in 3D",
    description:
      "Dress a 3D mannequin in your university's real graduation regalia: pick your Go8 campus, degree level, and faculty colours.",
    type: "website",
    siteName: "Grad Choice",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 800,
        alt: "Graduates throwing their caps in the air",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grad Choice · Go8 Graduation Regalia in 3D",
    description:
      "Dress a 3D mannequin in your university's real graduation regalia, faculty colours included.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Grad Choice",
  applicationCategory: "DesignApplication",
  description:
    "Interactive 3D preview of Australian Group of Eight graduation regalia with researched faculty colours.",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
