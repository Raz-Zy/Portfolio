'use client'

import ParticleField from '@/components/ParticleField'

/**
 * Fixed full-viewport cosmic backdrop shared by the whole page: base page
 * color, floating gradient blobs, grid pattern and the spinning particle
 * rings. It stays pinned while the content scrolls over it. Sections that
 * want to hide it (About, Skills, GitHub) paint their own opaque
 * backgrounds; the rest are transparent so the backdrop shows through.
 */
export default function CosmicBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-white dark:bg-gray-900 transition-colors duration-300"
      aria-hidden="true"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30 rounded-full blur-3xl animate-float opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-accent-100 to-orange-100 dark:from-accent-900/30 dark:to-orange-900/30 rounded-full blur-3xl animate-float-delay opacity-60"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full blur-2xl animate-float opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full blur-2xl animate-float-delay opacity-40"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-15 dark:opacity-10">
        <div className="w-full h-full bg-grid-pattern bg-grid-size"></div>
      </div>

      {/* Cosmic particle scene — spinning 3D rings over drifting dust, both
          repelled by the cursor; ring tilt is scroll-linked. */}
      <ParticleField className="absolute inset-0 w-full h-full" />
    </div>
  )
}
