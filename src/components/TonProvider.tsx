"use client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function TonProvider({ children }: { children: React.ReactNode }) {
  // Use the absolute URL for the manifest
  const manifestUrl = "https://ex-v2.vercel.app/tonconnect-manifest.json";

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
