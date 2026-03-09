"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  const pathname = usePathname();

  // Dashboard ya Admin check
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  // Suppress hydration warning only in development mode
  const suppressHydrationWarning = process.env.NODE_ENV === "development";

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
        suppressHydrationWarning={suppressHydrationWarning}  // ← This fixes the ontouchstart hydration error
      >
        <AuthProvider>
          <TonProvider>
            
            {/* AGAR DASHBOARD NAHI HAI, TABHI NAVBAR DIKHAO */}
            {!isDashboard && <Navbar />}
            
            <Toaster position="top-center" richColors theme="dark" />
            
            {/* MASELA YAHAN THA: 
               Agar Dashboard nahi hai, to Navbar ki wajah se 'pt-20' (Padding Top) deni zaroori hai
               taake Login/Register page Navbar ke peeche na chupen.
            */}
            <main className={!isDashboard ? "min-h-[80vh] pt-15 md:pt-15" : ""}>
              {children}
            </main>

            {/* AGAR DASHBOARD NAHI HAI, TABHI FOOTER DIKHAO */}
            {!isDashboard && <Footer />}
            
          </TonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}