import type { Metadata } from 'next'
import NewsletterClient from './NewsletterClient'

export const metadata: Metadata = {
  title: 'The Thinking Student | Vidya Bhumi',
  description:
    'The Thinking Student — Vidya Bhumi’s newsletter with fresh problems, concepts, and study insights for serious Mathematics and Biology aspirants.',
}

export default function NewsletterPage() {
  return <NewsletterClient />
}
