'use client'

import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaArrowRight,
  FaArrowUp,
  FaAsterisk,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import { useTranslation } from '@/i18n/useTranslation'

// This footer IS the contact section (page.tsx mounts it inside
// <section id="contact">): the old send-message form is gone, and the
// contact details live in the bottom bar's expandable panel instead.
// Locale-invariant config (links/icons/values); labels come from messages.
// The footer keeps its dark palette in BOTH themes (hard-coded hexes,
// no dark: variants) by design.
const socialLinks = [
  { href: 'https://github.com/Raz-Zy', icon: FaGithub, label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/dara-tan-98b499413',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://www.facebook.com/dara.tan.583',
    icon: FaFacebook,
    label: 'Facebook',
  },
  { href: 'https://t.me/TanDaras', icon: FaTelegram, label: 'Telegram' },
]

// Both files download from one click; the stagger keeps Safari/Firefox from
// swallowing the second download when two fire in the same tick.
const resumeFiles = ['Tan Dara Resume.pdf', 'Tan Dara Cover Letter.pdf']

function downloadResumeFiles() {
  resumeFiles.forEach((name, index) => {
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = encodeURI(`/${name}`)
      link.download = name
      document.body.appendChild(link)
      link.click()
      link.remove()
    }, index * 500)
  })
}

const contactDetails = [
  {
    icon: FaEnvelope,
    labelKey: 'contact.emailLabel',
    value: 'tandara120403@gmail.com',
    href: 'mailto:tandara120403@gmail.com',
  },
  {
    icon: FaPhone,
    labelKey: 'contact.phoneLabel',
    value: '+855 87 408 530',
    href: 'tel:+85587408530',
  },
  {
    icon: FaMapMarkerAlt,
    labelKey: 'contact.locationLabel',
    valueKey: 'contact.locationValue',
  },
]

// Shared pill classes — light (left buttons) and dark (Go Up), matching the
// reference: label + a circle holding the icon.
const lightPill =
  'group flex items-center gap-3 sm:gap-4 rounded-full bg-gray-200 hover:bg-white transition-colors pl-4 sm:pl-6 pr-1.5 py-1.5'
const pillLabel =
  'text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-900'
const pillCircle =
  'w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-700 text-gray-900 flex items-center justify-center'

export default function Footer() {
  const { t } = useTranslation()
  const [contactOpen, setContactOpen] = useState(false)

  return (
    // #contact must be able to fill the viewport on its own — shorter, and
    // scrolling to it bottoms out with the sticky experience deck's last card
    // still pinned above the footer. 100svh minus the 80px scroll-padding-top
    // (globals.css) so the anchor scroll lands with the whole footer visible
    // below the navbar. The headline card stretches (flex-1) to absorb the
    // extra height.
    <footer className="min-h-[calc(100svh-80px)] flex flex-col px-3 sm:px-6 pb-6">
      {/* headline card — sits ABOVE the action bar (z-10 + opaque bg) so the
          bar can hide underneath it and slide out */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 flex-1 flex flex-col justify-center bg-[#0b0e14] rounded-[2.5rem] px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center"
      >
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-gray-100">
          {t('hero.name')}
        </h2>
        <p className="mt-4 text-lg sm:text-2xl text-gray-500">
          {t('footer.tagline')}
        </p>

        <div className="mt-14 sm:mt-24 flex items-center justify-center gap-4 sm:gap-6">
          {socialLinks.map((social, index) => (
            <Fragment key={social.label}>
              {index > 0 && (
                <FaAsterisk className="text-gray-600 text-lg" aria-hidden />
              )}
              <motion.a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-[#232936] text-white flex items-center justify-center hover:bg-[#2f3746] transition-colors"
              >
                <social.icon size={18} />
              </motion.a>
            </Fragment>
          ))}
        </div>
      </motion.div>

      {/* action bar — tucked UNDER the headline card: -mt pulls its (rounded)
          top edge behind the card with no gap, the extra top padding keeps the
          pills clear of the overlap, and it springs out from underneath when
          it comes into view near the page bottom. whileInView (live
          IntersectionObserver rects), NOT a useScroll target scrub: useScroll
          caches the footer's page offsets, and the GitHub section growing
          async (plus the mobile URL bar resizing the viewport) left that
          cache stale — the scrub then never reached its end on phones and the
          bar stayed hidden until a resize re-measured it. No `once`, so it
          tucks back in when scrolled away and replays. The CONTACT pill
          expands it to reveal the details. */}
      <motion.div
        initial={{ y: -72 }}
        whileInView={{ y: 0 }}
        viewport={{ amount: 0.6 }}
        transition={{ type: 'spring', stiffness: 50, damping: 16 }}
        className="relative z-0 -mt-6 mx-1 sm:mx-8 bg-[#161b24] rounded-3xl px-3 sm:px-7 pt-10 pb-4 sm:pt-11 sm:pb-5"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={downloadResumeFiles}
            className={lightPill}
          >
            <span className={pillLabel}>{t('contact.downloadResume')}</span>
            <span
              className={`${pillCircle} transition-transform group-hover:translate-y-0.5`}
            >
              <FaDownload size={12} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setContactOpen((open) => !open)}
            aria-expanded={contactOpen}
            className={lightPill}
          >
            <span className={pillLabel}>{t('nav.contact')}</span>
            <span className={pillCircle}>
              <FaArrowRight
                size={12}
                className={`transition-transform duration-300 ${
                  contactOpen ? 'rotate-90' : ''
                }`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group ml-auto flex items-center gap-3 sm:gap-4 rounded-full bg-[#0b0e14] hover:bg-black transition-colors pl-4 sm:pl-6 pr-1.5 py-1.5"
          >
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.goUp')}
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2a3140] text-white flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
              <FaArrowUp size={12} />
            </span>
          </button>
        </div>

        {/* CSS grid-rows expansion, NOT a framer-motion height:'auto'
            animation: measuring 'auto' makes motion call window.scrollTo to
            restore the page position, which cancels an in-flight smooth
            scroll (e.g. Go Up) — see the same note in UXUIDesign.tsx. */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
            contactOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-5 pt-6 border-t border-white/10 grid gap-5 sm:grid-cols-3">
                {contactDetails.map((detail) => {
                  const value = detail.value ?? t(detail.valueKey)
                  const body = (
                    <>
                      <span className="w-10 h-10 flex-none rounded-full bg-[#232936] text-white flex items-center justify-center">
                        <detail.icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-gray-500">
                          {t(detail.labelKey)}
                        </span>
                        <span className="block text-sm sm:text-base text-gray-100 truncate">
                          {value}
                        </span>
                      </span>
                    </>
                  )
                  return detail.href ? (
                    <a
                      key={detail.labelKey}
                      href={detail.href}
                      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                      {body}
                    </a>
                  ) : (
                    <div key={detail.labelKey} className="flex items-center gap-4">
                      {body}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
