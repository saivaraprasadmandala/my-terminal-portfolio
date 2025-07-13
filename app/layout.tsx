import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: " Sai Vara Prasad Mandala - Terminal Portfolio",
  description: "Interactive terminal-based portfolio of Mandala Sai Vara Prasad - Front End Developer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black overflow-hidden">{children}</body>
    </html>
  )
}
