import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Exotic Cash | High-Yield Asset Terminal",
  description:
    "Secure, fast, and transparent high-yield investment platform for digital assets.",
  icons: {
    icon: "/favicon.svg",
  },
};

import AuthProvider from "@/components/SessionProvider";
import TonProvider from "@/components/TonProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        <AuthProvider>
          <TonProvider>
            <Navbar />
            <Toaster position="top-center" richColors theme="dark" />
            <main className="min-h-[70vh]">
              {children}
            </main>
            <Footer />
          </TonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
