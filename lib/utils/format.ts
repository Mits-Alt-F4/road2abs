export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 11) return 'Good morning.'
  if (h < 14) return 'What fits lunch?'
  if (h < 17) return 'Afternoon fuel.'
  if (h < 20) return 'What fits dinner?'
  return 'Late-night check.'
}

export function chf(amount: number): string {
  return `CHF ${amount.toFixed(2)}`
}

export function pct(value: number, max: number): number {
  return Math.min(100, Math.round((value / max) * 100))
}
