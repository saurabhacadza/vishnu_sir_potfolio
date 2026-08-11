'use client'

import { useEffect, useState } from 'react'
import { markSeen, type NewsletterItem } from '@/lib/newsletter'
import './newsletter.css'

const NEW_BADGE_DAYS = 7

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function isRecent(iso: string) {
  const ageMs = Date.now() - new Date(iso).getTime()
  return ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000
}

function thumbnailUrl(id: string) {
  // First page of the PDF, proxied through our server so it always loads
  return `/api/newsletter-thumb?id=${id}`
}

export default function NewsletterClient() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [activeItem, setActiveItem] = useState<NewsletterItem | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/newsletters')
        const data = await res.json()
        if (cancelled) return

        if (!data.success) throw new Error(data.error || 'Failed to load')

        const items: NewsletterItem[] = data.newsletters ?? []
        setNewsletters(items)
        setStatus('ready')

        // Visiting the page clears the header notification
        if (items[0]?.createdTime) markSeen(items[0].createdTime)
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Close viewer with Escape and lock body scroll while open
  useEffect(() => {
    if (!activeItem) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'auto'
    }
  }, [activeItem])

  return (
    <main className="page newsletter-page">
      <section className="newsletter-hero">
        <div className="container">
          <p className="newsletter-eyebrow">Vidya Bhumi Newsletter</p>
          <h1 className="newsletter-title">The Thinking Student</h1>
          <p className="newsletter-lede">
            Fresh problems, sharp concepts, and study insights — a new issue lands here regularly.
            Read online or download and dive in.
          </p>
        </div>
      </section>

      <section className="newsletter-body">
        <div className="container">
          {status === 'loading' && (
            <div className="newsletter-state" role="status">
              <span className="newsletter-spinner" aria-hidden="true" />
              Loading issues…
            </div>
          )}

          {status === 'error' && (
            <div className="newsletter-state newsletter-state--error" role="alert">
              Could not load the newsletter feed right now. Please try again in a moment.
            </div>
          )}

          {status === 'ready' && newsletters.length === 0 && (
            <div className="newsletter-state">
              The first issue of <strong>The Thinking Student</strong> is on its way. Check back soon!
            </div>
          )}

          {status === 'ready' && newsletters.length > 0 && (
            <div className="newsletter-grid">
              {newsletters.map((item, index) => (
                <article key={item.id} className="newsletter-card">
                  <button
                    type="button"
                    className="newsletter-card__media"
                    onClick={() => setActiveItem(item)}
                    aria-label={`Read ${item.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl(item.id)}
                      alt={`${item.title} cover`}
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />
                    {isRecent(item.createdTime) && (
                      <span className="newsletter-card__new">New</span>
                    )}
                    <span className="newsletter-card__read">Read issue</span>
                  </button>

                  <div className="newsletter-card__info">
                    <h2 className="newsletter-card__title">{item.title}</h2>
                    <p className="newsletter-card__date">{formatDate(item.createdTime)}</p>
                    <div className="newsletter-card__actions">
                      <button
                        type="button"
                        className="newsletter-btn newsletter-btn--primary"
                        onClick={() => setActiveItem(item)}
                      >
                        Read
                      </button>
                      <a
                        className="newsletter-btn newsletter-btn--ghost"
                        href={`https://drive.google.com/uc?export=download&id=${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PDF viewer overlay */}
      {activeItem && (
        <div
          className="newsletter-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveItem(null)
          }}
        >
          <div className="newsletter-viewer__panel">
            <header className="newsletter-viewer__bar">
              <h2>{activeItem.title}</h2>
              <div className="newsletter-viewer__bar-actions">
                <a
                  className="newsletter-btn newsletter-btn--ghost"
                  href={`https://drive.google.com/uc?export=download&id=${activeItem.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
                <button
                  type="button"
                  className="newsletter-viewer__close"
                  onClick={() => setActiveItem(null)}
                  aria-label="Close viewer"
                >
                  ✕
                </button>
              </div>
            </header>
            <iframe
              className="newsletter-viewer__frame"
              src={`https://drive.google.com/file/d/${activeItem.id}/preview`}
              title={activeItem.title}
              allow="autoplay"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  )
}
