'use client'

import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from '@/i18n/useTranslation'

// Optional external links per experience (index-aligned with experience.items).
const experienceLinks: (string | undefined)[] = [undefined, undefined, undefined]

// Full-bleed gradient per card, index-aligned with experience.items —
// overlapping deck cards must be opaque, and the bold color blocks follow
// the reference design's look.
const cardGradients = [
  'linear-gradient(135deg, #FF6B4A 0%, #E1332D 100%)',
  'linear-gradient(135deg, #4FB5DB 0%, #0984E3 100%)',
  'linear-gradient(135deg, #6C5CE7 0%, #4834D4 100%)',
]

export default function Experience() {
  const { t, m } = useTranslation()
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {t('experience.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Sticky card deck, full page width: each card pins below the navbar
          with a small per-index cascade offset, so scrolling down slides the
          next card over the previous one (a strip of each covered card stays
          visible); scrolling back up peels the deck apart again — all native
          position:sticky, no scroll hijacking. Sticky only from md up: on
          small screens a card can be taller than the viewport, so they stack
          normally there. */}
      <div className="px-3 md:px-6">
        {m.experience.items.map((item, index) => (
          <div
            key={index}
            className="md:sticky mb-6 last:mb-0"
            style={{ top: `${88 + index * 36}px` }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl p-6 md:p-12 md:min-h-[72vh] flex flex-col text-white shadow-primary-lg overflow-hidden"
              style={{ background: cardGradients[index % cardGradients.length] }}
            >
              {/* Top: small centered label, like the reference's (PB)/(GO) */}
              <div className="text-center text-sm tracking-[0.2em] uppercase text-white/70 mb-8 md:mb-10">
                ({item.type})
              </div>

              {/* Middle: big title on the left, huge index on the right */}
              <div className="flex items-start justify-between gap-6 flex-1">
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
                    {item.title}
                  </h3>
                  <p className="text-xl md:text-2xl text-white/85 font-semibold mt-3">
                    {item.company}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm text-white/75">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt />
                      {item.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      {item.location}
                    </span>
                    {experienceLinks[index] && (
                      <a
                        href={experienceLinks[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-white/70 transition-colors underline underline-offset-4"
                      >
                        <FaExternalLinkAlt />
                        {t('experience.viewProject')}
                      </a>
                    )}
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-6xl md:text-8xl font-bold text-white/80 leading-none shrink-0"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Bottom: bordered two-column details + technology pills */}
              <div className="mt-10 md:mt-12">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                  {item.description.map((desc, descIndex) => (
                    <div
                      key={descIndex}
                      className="pt-4 border-t border-white/30 flex items-start gap-3 text-sm md:text-base text-white/90"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>

                {item.technologies && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {item.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
