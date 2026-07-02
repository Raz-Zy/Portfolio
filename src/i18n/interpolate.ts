/**
 * Replace `{name}` placeholders in a translation string with values.
 * Unknown placeholders are left untouched so missing vars are visible.
 */
export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`
  )
}
