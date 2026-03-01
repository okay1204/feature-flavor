import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LDProviderWrapper } from "@/components/LDProviderWrapper";
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
  title: "Feature Flavor",
  description: "A feature-flagged recipe manager built with Next.js, FastAPI, and PostgreSQL, showcasing LaunchDarkly for progressive delivery, feature rollouts, and experimentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LDProviderWrapper>{children}</LDProviderWrapper>
      </body>
    </html>
  );
}
