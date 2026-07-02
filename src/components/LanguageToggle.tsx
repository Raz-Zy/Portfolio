'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/i18n/LocaleProvider'
import { useTranslation } from '@/i18n/useTranslation'

interface LanguageToggleProps {
  /** `icon` = compact circular button (desktop nav); `full` = labelled row (mobile menu). */
  variant?: 'icon' | 'full'
}

export default function LanguageToggle({ variant = 'icon' }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()

  const toggle = () => setLocale(locale === 'en' ? 'km' : 'en')
  // Show the language you would switch TO.
  const label = locale === 'en' ? 'ខ្មែរ' : 'EN'

  if (variant === 'full') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        aria-label={t('nav.toggleLanguage')}
        className="flex items-center space-x-3 px-8 py-4 rounded-full text-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-base font-bold">{label}</span>
        <span>{locale === 'en' ? 'ភាសាខ្មែរ' : 'English'}</span>
      </motion.button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      aria-label={t('nav.toggleLanguage')}
      className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
    >
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
    </motion.button>
  )
}
