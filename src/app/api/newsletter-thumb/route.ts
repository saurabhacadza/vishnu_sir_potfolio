// src/app/api/newsletter-thumb/route.ts
// Proxies Google Drive PDF thumbnails so they always render in the browser
// (direct drive.google.com/thumbnail requests can be blocked client-side).
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !/^[A-Za-z0-9_-]{10,}$/.test(id)) {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://drive.google.com/thumbnail?id=${id}&sz=w640`, {
      // Thumbnails rarely change; cache for a day on the server
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Thumbnail unavailable' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/png'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error', detail: `${e}` }, { status: 500 })
  }
}
