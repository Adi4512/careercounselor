import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper  from "@/components/SessionWrapper";
import Providers from "@/lib/providers";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevare AI – AI-Powered Career Counseling for Your Future.",
  description: "Elevare AI is an AI-powered career counseling platform that helps you discover the right career path, make smarter decisions, and achieve professional growth with personalized AI guidance.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      // { url: '/icon.svg', type: 'image/svg+xml' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-32`}
      >
        <Providers>
          <SessionWrapper>
            {children}
           
          </SessionWrapper>
        </Providers>
      </body>
    </html>
  );
}
