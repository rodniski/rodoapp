import { Inter } from "next/font/google"
import { ThemeProvider } from "comp"
import { MouseMoveEffect } from "ui"
import { Navbar } from "comp"
import type React from "react"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressContentEditableWarning suppressHydrationWarning>
      <body className={`${inter.className} antialiased flex flex-col justify-start items-center w-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MouseMoveEffect />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



