// Shared client-side helpers for "The Thinking Student" newsletter
// notification badge (last-seen tracking between the nav and the page).

export const NEWSLETTER_SEEN_KEY = 'tts-newsletter-last-seen'
export const NEWSLETTER_SEEN_EVENT = 'tts-newsletter-seen'

export type NewsletterItem = {
  id: string
  name: string
  title: string
  createdTime: string
  modifiedTime: string
  size?: string
}

export function getLastSeen(): string | null {
  try {
    return localStorage.getItem(NEWSLETTER_SEEN_KEY)
  } catch {
    return null
  }
}

export function markSeen(latestCreatedTime: string) {
  try {
    localStorage.setItem(NEWSLETTER_SEEN_KEY, latestCreatedTime)
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NEWSLETTER_SEEN_EVENT))
  }
}

export function hasUnseen(latestCreatedTime: string | undefined): boolean {
  if (!latestCreatedTime) return false
  const seen = getLastSeen()
  if (!seen) return true
  return new Date(latestCreatedTime).getTime() > new Date(seen).getTime()
}
