import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
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
  title: "MindGood - Multilingual Mental Health Support",
  description:
    "Connect with psychologists who speak your language. Professional mental health support in Malayalam, Tamil, Hindi, Telugu, and Kannada.",
  keywords:
    "mental health, psychologist in Dubai, best psychologist in Dubai, therapist in UAE, anxiety counseling Dubai, depression therapy, couples therapy Dubai, trauma therapist, child psychologist Dubai, affordable therapy UAE, Malayalam speaking psychologist, Tamil counseling UAE, Hindi therapist Dubai, online therapy, career counseling, stress management, counseling near me",
  icons: {
    icon: "/mindgood.ico",
    apple: "/Mindgood.png",
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
