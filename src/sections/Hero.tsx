'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FaEnvelope, FaEye, FaGithub, FaFacebook, FaTelegram } from 'react-icons/fa'
import { useTranslation } from '@/i18n/useTranslation'

// Timing: the black->white intro curtain plays first, then content reveals.
const INTRO = 1.0 // seconds the curtain takes before text starts
const EASE_OUT = [0.22, 1, 0.36, 1] as const

// Slide a block in from the left after the curtain lifts.
const slideInLeft = (delay: number) => ({
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
})

export default function Hero() {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  // Scroll-scrubbed exit: as the hero scrolls off, the content sinks, shrinks
  // and fades. The cosmic background itself is fixed (see CosmicBackground
  // mounted in page.tsx) so it stays pinned while content scrolls over it.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden mt-20">
      {/* Intro curtain: a black circle appears in the middle of a white screen,
          scales up to fill the screen, then fades black -> white to reveal the
          hero. White backdrop fades out last so it blends into the page. */}
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: INTRO - 0.2, ease: 'easeInOut' }}
      >
        <motion.div
          className="w-[150vmax] h-[150vmax] rounded-full bg-black"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{
            duration: INTRO - 0.1,
            times: [0, 0.55, 1],
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <motion.div
        className="container mx-auto px-6 text-center relative z-10"
        style={reducedMotion ? undefined : { y: contentY, scale: contentScale, opacity: contentOpacity }}
      >
        <div className="mb-8">
          {/* Enhanced Profile Image */}
          <motion.div
            className="w-80 h-80 mx-auto mb-4 relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: INTRO + 0.1, ease: EASE_OUT }}
          >
            {/* Floating Animation Container */}
            <motion.div
              className="relative w-full h-full"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: INTRO + 0.9,
              }}
            >
              {/* Gradient Background Ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-orange-500 dark:from-primary-400 dark:via-accent-400 dark:to-orange-400 rounded-full p-1 shadow-primary-lg">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full p-1">
                  {/* Profile Image */}
                  <motion.img
                    src="/Profile.png"
                    alt="Tan Dara Profile"
                    className="w-full h-full object-cover rounded-full shadow-primary relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </div>
              </div>

              {/* Floating Shadow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent dark:via-primary-400/30 rounded-full blur-md opacity-60"></div>

              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-orange-500/20 dark:from-primary-400/20 dark:via-accent-400/20 dark:to-orange-400/20 rounded-full blur-lg animate-pulse -z-10"></div>

              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-white to-yellow-200 dark:from-yellow-200 dark:to-white rounded-full opacity-80"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-br from-white to-blue-200 dark:from-blue-200 dark:to-white rounded-full opacity-70"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />

              <motion.div
                className="absolute top-4 -left-4 w-1.5 h-1.5 bg-gradient-to-br from-white to-accent-200 dark:from-accent-200 dark:to-white rounded-full opacity-60"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>

          {/* Name in a glass pill, with reveal animation (slides up
              from behind a mask) */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="glass-pill inline-flex items-center justify-center px-8 py-3 md:px-12 md:py-4"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: INTRO + 0.25, ease: EASE_OUT }}
              >
                <span className="text-gradient">{t('hero.name')}</span>
              </motion.span>
            </span>
          </h1>

          <div className="overflow-hidden mb-4">
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-semibold"
              initial={{ y: '120%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: INTRO + 0.7, ease: EASE_OUT }}
            >
              {t('hero.role')}
            </motion.p>
          </div>

          <div className="overflow-hidden max-w-2xl mx-auto">
            <motion.p
              className="text-sm xl:text-lg 2xl:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              initial={{ y: '120%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: INTRO + 1.0, ease: EASE_OUT }}
            >
              {t('hero.tagline')}
            </motion.p>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <motion.div
          {...slideInLeft(INTRO + 1.3)}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
        >
          <motion.button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-500 dark:to-accent-500 text-white px-6 py-3 rounded-full font-semibold hover:from-primary-700 hover:to-accent-700 dark:hover:from-primary-600 dark:hover:to-accent-600 transition-all duration-300 flex items-center gap-3 shadow-primary hover:shadow-primary-lg transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEye />
            {t('hero.viewWork')}
          </motion.button>

          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all duration-300 flex items-center gap-2 shadow-primary hover:shadow-primary-lg transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope />
            {t('hero.contactMe')}
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          {...slideInLeft(INTRO + 1.5)}
          className="flex justify-center gap-6 mb-2"
        >
          <motion.a
            href="https://github.com/Raz-Zy"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white transition-all duration-300 shadow-primary hover:shadow-primary-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FaGithub size={20} />
          </motion.a>
          <motion.a
            href="https://www.facebook.com/dara.tan.583"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 shadow-primary hover:shadow-primary-lg"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <FaFacebook size={20} />
          </motion.a>
          <motion.a
            href="https://t.me/TanDaras"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-primary hover:shadow-primary-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FaTelegram size={20} />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: INTRO + 1.7 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('hero.scroll')}</p>
          <motion.div
            className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center bg-gray-50 dark:bg-gray-800/50 shadow-inner"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-3 bg-gradient-to-b from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
