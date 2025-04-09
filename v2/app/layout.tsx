"use client"; // Mantido pois Providers pode precisar de client-side
import { Outfit } from "next/font/google";
import { Navbar, Providers } from "comp";
import { Toaster } from "sonner";
import type React from "react";
import "./globals.css";

const font = Outfit({
  subsets: ["latin"],
  display: "optional", 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressContentEditableWarning suppressHydrationWarning>
      <body className={`${font.className} antialiased min-h-screen bg-background flex flex-col justify-start items-center`}>
        <Providers>
          <Toaster />
          <Navbar />
          <main className="w-full flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}