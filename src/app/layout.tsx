// i18n note: this site uses a lightweight client-side locale toggle (see
// src/i18n/). The SEO metadata below and the server-rendered `<html lang>` stay
// English on purpose — a client-only approach can't localize server-rendered
// SEO. If bilingual SEO is ever required, move to locale-prefixed routing.
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Khmer } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { LocaleProvider } from '@/i18n/LocaleProvider'

// Khmer webfont. Noto Sans Khmer only carries Khmer glyphs, so Latin text
// falls through to the system stack (see tailwind.config.js fontFamily).
const notoKhmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '500', '700'],
  variable: '--font-khmer',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dara Portfolio | Aspiring Developer & Creative Designer',
  description: 'Modern portfolio showcasing development skills, design projects, and professional experience. Specializing in web development, UX/UI design, and creative solutions.',
  keywords: [
    'portfolio', 'developer', 'designer', 'programming', 'web development',
    'UX/UI design', 'frontend developer', 'full-stack developer', 'creative designer',
    'Tan Dara', 'software engineer', 'web designer', 'user experience',
    'React', 'Next.js', 'TypeScript', 'Figma', 'GitHub', 'JavaScript'
  ],
  authors: [{ name: 'Tan Dara' }],
  creator: 'Tan Dara',
  publisher: 'Tan Dara',
  metadataBase: new URL('https://dara-it.site'),
  alternates: {
    canonical: 'https://dara-it.site',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dara-it.site',
    title: 'Dara Portfolio | Aspiring Developer & Creative Designer',
    description: 'Modern portfolio showcasing development skills, design projects, and professional experience. Specializing in web development, UX/UI design, and creative solutions.',
    siteName: 'Dara Portfolio',
    images: [
      {
        url: '/images/Profile.png',
        width: 1200,
        height: 630,
        alt: 'Dara Portfolio - Developer & Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dara Portfolio | Aspiring Developer & Creative Designer',
    description: 'Modern portfolio showcasing development skills, design projects, and professional experience.',
    images: ['/images/Profile.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#7c3aed' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={notoKhmer.variable}>
      <head>
        {/* Additional SEO meta tags */}
        <meta name="application-name" content="Dara Portfolio" />
        <meta name="apple-mobile-web-app-title" content="Dara Portfolio" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Tan Dara",
              "jobTitle": "Aspiring Developer & Creative Designer",
              "description": "Modern portfolio showcasing development skills, design projects, and professional experience.",
              "url": "https://dara-it.site",
              "image": "https://dara-it.site/images/Profile.png",
              "sameAs": [
                "https://github.com/Raz-Zy",
                "https://www.facebook.com/dara.tan.583",
                "https://t.me/TanDaras"
              ],
              "knowsAbout": [
                "Web Development",
                "UX/UI Design",
                "Frontend Development",
                "Full-Stack Development",
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Figma",
                "Creative Design"
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Web Developer",
                "description": "Developing modern web applications and user interfaces"
              }
            })
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <LocaleProvider>
          <Navbar />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}