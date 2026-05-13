import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://svp-terminal-portfolio-six.vercel.app";
const FULL_NAME = "Sai Vara Prasad Mandala";
const ROLE = "Frontend Developer";
const LOCATION = "Hyderabad, India";
const DESCRIPTION = `${FULL_NAME} is a ${ROLE} based in ${LOCATION}. Explore projects, skills, work experience and contact information through an interactive terminal-style portfolio.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${FULL_NAME} - ${ROLE}`,
    template: `%s | ${FULL_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: `${FULL_NAME} — Portfolio`,
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  publisher: FULL_NAME,
  keywords: [
    // Full name + permutations
    "Sai Vara Prasad Mandala",
    "Mandala Sai Vara Prasad",
    "Sai Vara Prasad",
    "Vara Prasad Mandala",
    "Sai Mandala",
    "Mandala Sai",
    // Standalone given/family names
    "Sai",
    "Vara Prasad",
    "Mandala",
    // Standalone names + role / location qualifiers
    "Sai Vara Prasad developer",
    "Sai Vara Prasad Hyderabad",
    "Sai Vara Prasad frontend developer",
    "Sai Vara Prasad portfolio",
    "Mandala developer",
    "Mandala Hyderabad",
    "Mandala frontend",
    // Online handles
    "msvp2k04",
    // Role + location
    "Frontend Developer Hyderabad",
    "React developer Hyderabad",
    "Next.js developer India",
    "TypeScript developer Hyderabad",
    // Site-type
    "terminal portfolio",
    "interactive portfolio",
  ],
  category: "technology",
  classification: "Personal Portfolio",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: SITE_URL,
    siteName: FULL_NAME,
    title: `${FULL_NAME} — ${ROLE}`,
    description: DESCRIPTION,
    firstName: "Sai Vara Prasad",
    lastName: "Mandala",
    username: "msvp2k04",
  },
  twitter: {
    card: "summary_large_image",
    title: `${FULL_NAME} — ${ROLE}`,
    description: DESCRIPTION,
    creator: "@msvp2k04",
    site: "@msvp2k04",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: FULL_NAME,
  alternateName: [
    "Mandala Sai Vara Prasad",
    "Sai Vara Prasad",
    "Vara Prasad Mandala",
    "Sai",
    "Mandala",
    "msvp2k04",
  ],
  givenName: "Sai Vara Prasad",
  familyName: "Mandala",
  gender: "Male",
  url: SITE_URL,
  image: `${SITE_URL}/profile.png`,
  jobTitle: ROLE,
  description: DESCRIPTION,
  nationality: "Indian",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Frontend Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
  ],
  sameAs: [
    "https://github.com/msvp2k04",
    "https://x.com/msvp2k04",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${FULL_NAME} — Portfolio`,
  url: SITE_URL,
  inLanguage: "en",
  author: { "@type": "Person", name: FULL_NAME, url: SITE_URL },
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#020403]">{children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, websiteJsonLd]),
          }}
        />
      </body>
    </html>
  );
}
