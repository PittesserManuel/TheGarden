/**
 * Format price in Euro (e.g. "€ 12,50")
 */
export function formatPrice(price: number): string {
  return `€\u00A0${price.toFixed(2).replace('.', ',')}`
}

/**
 * Format date in German format (e.g. "09.03.2026")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Format date with time (e.g. "09.03.2026, 14:30")
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format time only (e.g. "14:30")
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
