// src/app/api/newsletter-thumb/route.ts
// Cover image for a newsletter issue.
//
// Google Drive rendered PDF first pages for us; S3 does not. So we look for a
// companion image uploaded next to the PDF (same name, image extension) and
// fall back to a generated cover when there isn't one. That way the grid looks
// right from day one and you can add real covers later at your own pace.
import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NEWSLETTER_PREFIX, S3_BUCKET, isSafeKey, s3, s3Configured, titleFromKey } from '@/lib/s3'

export const dynamic = 'force-dynamic'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Wrap the title onto at most three lines so long names stay readable.
function wrap(title: string, perLine = 16, maxLines = 3): string[] {
  const words = title.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    if (!line) {
      line = word
    } else if (`${line} ${word}`.length <= perLine) {
      line = `${line} ${word}`
    } else {
      lines.push(line)
      line = word
      if (lines.length === maxLines) break
    }
  }
  if (line && lines.length < maxLines) lines.push(line)
  return lines
}

function placeholderCover(title: string): NextResponse {
  const lines = wrap(title)
  const startY = 210 - (lines.length - 1) * 26

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="620" viewBox="0 0 480 620" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0f1d30"/>
    </linearGradient>
  </defs>
  <rect width="480" height="620" fill="url(#g)"/>
  <rect x="36" y="36" width="408" height="548" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
  <text x="240" y="130" text-anchor="middle" fill="#9fc3ff" font-family="Georgia, 'Times New Roman', serif" font-size="19" letter-spacing="3">THE THINKING STUDENT</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="240" y="${startY + i * 52}" text-anchor="middle" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="40">${escapeXml(l)}</text>`
    )
    .join('\n  ')}
  <text x="240" y="548" text-anchor="middle" fill="#9fc3ff" font-family="Georgia, 'Times New Roman', serif" font-size="17" letter-spacing="2">VIDYA BHUMI</text>
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key || !isSafeKey(key, NEWSLETTER_PREFIX)) {
    return NextResponse.json({ error: 'Missing or invalid key' }, { status: 400 })
  }

  const title = titleFromKey(key)
  if (!s3Configured()) return placeholderCover(title)

  const base = key.replace(/\.pdf$/i, '')

  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = `${base}${ext}`
    try {
      await s3().send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: candidate }))
    } catch {
      continue // not there — try the next extension
    }

    try {
      const url = await getSignedUrl(
        s3(),
        new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: candidate,
          ResponseContentType: CONTENT_TYPES[ext],
        }),
        { expiresIn: 60 * 60 }
      )
      return NextResponse.redirect(url, {
        status: 307,
        headers: { 'Cache-Control': 'private, max-age=600' },
      })
    } catch (error) {
      console.error('Presigning newsletter cover failed', candidate, error)
      break
    }
  }

  return placeholderCover(title)
}
