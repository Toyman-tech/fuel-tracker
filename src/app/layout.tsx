import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { SimulatorProvider } from "@/context/SimulatorContext";

export const metadata: Metadata = {
  title: "IoT Fuel Verification System | Real-time Dispenser & Ledger",
  description: "Passive real-time monitoring and anti-fraud cryptographic ledger for gas station fuel dispensers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050811] text-slate-100 antialiased min-h-screen">
        <SimulatorProvider>
          <AppShell>{children}</AppShell>
        </SimulatorProvider>
      </body>
    </html>
  );
}


