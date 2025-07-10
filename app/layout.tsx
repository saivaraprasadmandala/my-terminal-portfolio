import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jaini Sai Abhiram - Terminal Portfolio",
  description: "Interactive terminal-based portfolio of Jaini Sai Abhiram - Full Stack Developer & DevOps Engineer",
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
