'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LOGO } from '@/lib/constants'
import { hasUnseen, NEWSLETTER_SEEN_EVENT } from '@/lib/newsletter'

type NavItem = {
  label: string
  href: string
  variant?: 'dost' | 'newsletter'
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/#courses' },
  { label: 'Why Us', href: '/vidyabhumi_unique' },
  { label: 'About us', href: '/about_us' },
  { label: 'Dost', href: '/dost', variant: 'dost' },
  { label: 'The Thinking Student', href: '/newsletter', variant: 'newsletter' },
  { label: 'Faculty', href: '/#faculty' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Gallery', href: '/galery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [hasNewIssue, setHasNewIssue] = useState(false)

  // Initialize theme from document
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null
    if (currentTheme) setTheme(currentTheme)
  }, [])

  // Check for a new "The Thinking Student" issue → show badge on the tab
  useEffect(() => {
    let cancelled = false

    async function checkNewsletter() {
      try {
        const res = await fetch('/api/newsletters')
        const data = await res.json()
        const latest = data?.newsletters?.[0]?.createdTime as string | undefined
        if (!cancelled) setHasNewIssue(hasUnseen(latest))
      } catch {
        /* silent — badge is best-effort */
      }
    }

    checkNewsletter()

    // Clear the badge as soon as the newsletter page marks issues as seen
    const onSeen = () => setHasNewIssue(false)
    window.addEventListener(NEWSLETTER_SEEN_EVENT, onSeen)
    return () => {
      cancelled = true
      window.removeEventListener(NEWSLETTER_SEEN_EVENT, onSeen)
    }
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  // Toggle theme
  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    document.documentElement.style.colorScheme = newTheme
  }, [theme])

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeMobileMenu()
    }
  }

  return (
    <>
      {/* Navigation Header */}
      <header data-nav className={`site-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Logo */}
          <div className="nav-brand">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                src={LOGO}
                alt="Vidya Bhumi Logo"
                width={140}
                height={140}
                priority
                className="brand-logo"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="nav-desktop">
            <ul className="menu rw-menu">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={
                      item.variant === 'dost'
                        ? 'nav-dost-link'
                        : item.variant === 'newsletter'
                          ? 'nav-newsletter-link'
                          : undefined
                    }
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                    {item.variant === 'newsletter' && hasNewIssue && (
                      <span className="nav-newsletter-dot" aria-label="New issue available" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side controls */}
          <div className="nav-actions">
            <Link
              href="/dost"
              className="nav-mobile-dost"
              aria-label="Open Vidya Bhumi Dost"
              onClick={closeMobileMenu}
            >
              Dost
            </Link>
            {/* Mobile menu toggle */}
            <button
              className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>

            {/* Theme toggle */}
            <div className="theme-toggle">
              <button
                onClick={handleThemeToggle}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                type="button"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-backdrop show"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'show' : ''}`}>
        <button
          className="mobile-menu-close"
          onClick={closeMobileMenu}
          aria-label="Close menu"
          type="button"
        >
          ✕
        </button>

        <ul className="mobile-menu-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="mobile-menu-item">
              <Link
                href={item.href}
                className={`mobile-menu-link${item.variant === 'dost' ? ' nav-dost-link' : ''}${
                  item.variant === 'newsletter' ? ' nav-newsletter-link' : ''
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
                {item.variant === 'newsletter' && hasNewIssue && (
                  <span className="nav-newsletter-dot" aria-label="New issue available" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
