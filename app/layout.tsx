"use client";
import { Roboto } from "next/font/google";
import { Providers } from "ui";
import "./globals.css";

const font = Roboto({
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
        className={`${font.className} antialiased min-h-screen flex flex-col`}
      >

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
