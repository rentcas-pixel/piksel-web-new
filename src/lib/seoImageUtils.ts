/**
 * SEO utilities for images - alt text and filenames based on Piksel keywords
 * Raktiniai žodžiai: LED ekranas, reklama ekranuose, reklama led ekrane, video ekranas, lauko ekranas, reklamos tinklas, PIKSEL
 */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (c) => ({ ą: 'a', č: 'c', ę: 'e', ė: 'e', į: 'i', š: 's', ų: 'u', ū: 'u', ž: 'z' }[c] || c))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

/** LED ekrano nuotraukos alt tekstas su raktiniais žodžiais */
export function generateScreenImageAlt(
  name: string,
  city: string,
  options?: { sideName?: string; isViaduct?: boolean }
): string {
  const base = `${name} - LED ekranas, reklama ekranuose, ${city}`
  const keywords = 'reklama led ekrane, video ekranas, lauko ekranas, reklamos tinklas, PIKSEL'
  if (options?.sideName) {
    return `${base}, ${options.sideName} - ${keywords}`
  }
  if (options?.isViaduct) {
    return `${base}, viaduko ekranas - ${keywords}`
  }
  return `${base} - ${keywords}`
}

/** Naujienos nuotraukos alt tekstas su raktiniais žodžiais */
export function generateNewsImageAlt(title: string, tag?: string): string {
  const base = `${title} - PIKSEL naujienos`
  const keywords = 'LED ekranai, reklama ekranuose, reklamos tinklas Lietuvoje'
  return tag ? `${base}, ${tag} - ${keywords}` : `${base} - ${keywords}`
}

/** SEO draugiškas failo pavadinimas ekrano nuotraukai */
export function generateScreenImageFileName(
  city: string,
  name: string,
  type: 'main' | 'mobile' | 'side_a' | 'side_b',
  ext: string
): string {
  const citySlug = city ? slugify(city) : 'ekranas'
  const nameSlug = name ? slugify(name) : 'led-ekranas'
  const typeSuffix = type === 'main' ? '' : `-${type}`
  return `ekranai/${citySlug}-${nameSlug}${typeSuffix}-${Date.now()}.${ext}`
}

/** SEO draugiškas failo pavadinimas naujienos nuotraukai */
export function generateNewsImageFileName(title: string, ext: string): string {
  const baseSlug = title ? slugify(title).slice(0, 50) : 'naujiena'
  return `news/${baseSlug}-${Date.now()}.${ext}`
}
