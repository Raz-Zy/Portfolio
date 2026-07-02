'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'en' | 'km'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Always start as 'en' so server HTML and the first client render match
  // (no hydration mismatch). The saved locale is applied after mount below —
  // the same tradeoff the dark-mode toggle already makes with localStorage.
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale')
    if (saved === 'km' || saved === 'en') {
      setLocaleState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('locale', next)
    // Drives the Khmer font / line-height rules in globals.css.
    document.documentElement.lang = next
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
