import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

const siteUrl = "https://svp-terminal-portfolio-six.vercel.app"

export const metadata: Metadata = {
  title: "Sai Vara Prasad Mandala - Terminal Portfolio",
  description:
    "Interactive terminal-based portfolio of Sai Vara Prasad Mandala — Frontend Developer from Hyderabad, India. Explore projects, skills, and experience.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sai Vara Prasad Mandala - Terminal Portfolio",
    description:
      "Interactive terminal-based portfolio of Sai Vara Prasad Mandala — Frontend Developer. Explore projects, skills, and experience.",
    url: siteUrl,
    siteName: "Sai Vara Prasad Mandala Portfolio",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Vara Prasad Mandala - Terminal Portfolio",
    description:
      "Interactive terminal-based portfolio — Frontend Developer from Hyderabad, India.",
    creator: "@msvp2k04",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
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
