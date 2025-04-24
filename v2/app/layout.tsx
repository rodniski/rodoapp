// app/layout.tsx
"use client";
import { Outfit } from "next/font/google";
import { Providers } from "comp/providers";
import "./globals.css";

const font = Outfit({
  subsets: ["latin"],
  display: "optional",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={`${font.className} antialiased min-h-screen bg-background flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
