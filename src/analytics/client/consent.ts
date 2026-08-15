export type ConsentChoice = 'granted' | 'denied'
const key = 'ff-analytics-consent'
export function getConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(key)
  return value === 'granted' || value === 'denied' ? value : null
}
export function setConsent(value: ConsentChoice) {
  localStorage.setItem(key, value)
  window.dispatchEvent(new CustomEvent('analytics-consent', { detail: value }))
}
