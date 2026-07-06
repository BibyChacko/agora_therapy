import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { defaultKeywords, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Online Therapy in Dubai, UAE & GCC`,
    template: `%s | ${siteName}`,
  },
  description:
    "MindGood connects individuals, couples, and families in Dubai, the UAE, and across the GCC with licensed online psychologists and multilingual therapy support.",
  keywords: defaultKeywords,
  applicationName: siteName,
  icons: {
    icon: "/mindgood.ico",
    apple: "/Mindgood.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteName} | Online Therapy in Dubai, UAE & GCC`,
    description:
      "Book confidential online therapy with multilingual psychologists supporting Dubai, the UAE, and the wider GCC.",
    url: siteUrl,
    siteName,
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/images/hero-image.webp",
        width: 1200,
        height: 630,
        alt: "MindGood online therapy in Dubai, UAE and GCC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Online Therapy in Dubai, UAE & GCC`,
    description:
      "Confidential online therapy for Dubai, the UAE, and the GCC with multilingual psychologists.",
    images: ["/images/hero-image.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/mindgood.ico" />
        <link rel="icon" href="/Logo.svg" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai" />
        <meta name="ICBM" content="25.2048, 55.2708" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
