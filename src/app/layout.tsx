import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Dara Portfolio | Aspiring Developer & Creative Designer',
  description: 'Modern portfolio showcasing development skills, design projects, and professional experience.',
  keywords: ['portfolio', 'developer', 'designer', 'programming', 'web development'],
  authors: [{ name: 'Tan Dara' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        {children}
      </body>
    </html>
  )
}