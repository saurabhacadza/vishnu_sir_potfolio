// src/app/api/newsletters/route.ts
// Lists newsletter PDFs from the public Google Drive folder.
// Fetched fresh on every request, so new uploads appear instantly.
import { NextResponse } from 'next/server'
import { DRIVE_API_KEY, NEWSLETTER_FOLDER_ID } from '@/lib/newsletterConfig'

export const dynamic = 'force-dynamic'

const FOLDER_ID = NEWSLETTER_FOLDER_ID
const API_KEY = DRIVE_API_KEY

export type NewsletterFile = {
  id: string
  name: string
  title: string
  createdTime: string
  modifiedTime: string
  size?: string
}

export async function GET() {
  if (!FOLDER_ID || !API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Newsletter feed is not configured', newsletters: [] },
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    q: `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
    fields: 'files(id,name,createdTime,modifiedTime,size)',
    orderBy: 'createdTime desc',
    pageSize: '100',
    key: API_KEY,
  })

  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Drive newsletter fetch failed', res.status, detail)
      return NextResponse.json(
        { success: false, error: 'Unable to load newsletters right now', newsletters: [] },
        { status: 502 }
      )
    }

    const data = (await res.json()) as { files?: Omit<NewsletterFile, 'title'>[] }

    const newsletters: NewsletterFile[] = (data.files ?? []).map((f) => ({
      ...f,
      // "The_Thinking_Student_Vol-1.pdf" -> "The Thinking Student Vol-1"
      title: f.name.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim(),
    }))

    return NextResponse.json(
      { success: true, newsletters },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Drive newsletter fetch errored', error)
    return NextResponse.json(
      { success: false, error: 'Unable to load newsletters right now', newsletters: [] },
      { status: 500 }
    )
  }
}
