'use client'

import { useLocale } from './LocaleProvider'
import { messages } from './messages'
import { interpolate } from './interpolate'

/**
 * Access translations for the active locale.
 * - `t('contact.modal.successTitle')` — dot-path lookup for scalar strings,
 *   with optional interpolation: `t('github.showingRepos', { count })`.
 * - `m` — the raw typed message dictionary, for iterating arrays
 *   (e.g. `m.education.items.map(...)`).
 */
export function useTranslation() {
  const { locale } = useLocale()
  const m = messages[locale]

  const t = (path: string, vars?: Record<string, string | number>): string => {
    const value = path
      .split('.')
      .reduce<unknown>(
        (obj, key) =>
          obj && typeof obj === 'object'
            ? (obj as Record<string, unknown>)[key]
            : undefined,
        m
      )
    return typeof value === 'string' ? interpolate(value, vars) : path
  }

  return { t, m, locale }
}
