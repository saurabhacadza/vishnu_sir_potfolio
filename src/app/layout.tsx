import type { Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import './additional-styles.css'

import Navigation from './components/layout/Navigation'
import ScrollProgress from './components/animations/ScrollProgress'
import ParticlesBackground from './components/animations/ParticlesBackground'
import StemOverlay from './components/animations/StemOverlay'
import ScrollManager from './components/layout/ScrollManager'
import FloatingContact from './components/layout/FloatingContact'
import RouteClassManager from './components/layout/RouteClassManager'

import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SSR default theme (prevents hydration mismatch)
  const cookieTheme = 'dark'

  return (
    <html
      lang="en"
      data-theme={cookieTheme}
      style={{ colorScheme: cookieTheme }}
      suppressHydrationWarning
    >
      <head>
        {/* Early theme setup to avoid flash */}
        <Script id="early-theme" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var stored = localStorage.getItem('theme');
                // Default to dark unless the user explicitly chose otherwise.
                var theme = stored || 'dark';
                var de = document.documentElement;

                de.setAttribute('data-theme', theme);
                de.style.colorScheme = theme;

                document.cookie =
                  'theme=' + theme +
                  '; Path=/; Max-Age=31536000; SameSite=Lax';
              } catch (e) {}
            })();
          `}
        </Script>
      </head>

      <body className={`${inter.className} ${montserrat.variable}`}>
        <RouteClassManager />
        <div className="app-shell">
          <ScrollManager />
          <ScrollProgress />
          <ParticlesBackground />
          <StemOverlay />
          <div className="page-grid-overlay" aria-hidden="true" />

          <Navigation />
          <FloatingContact />
        </div>

        <main className="page">{children}</main>
      </body>
    </html>
  )
}
