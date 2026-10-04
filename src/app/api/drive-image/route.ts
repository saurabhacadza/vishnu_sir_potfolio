// src/app/api/drive-image/route.ts
// Serves images for the site.
//
// ?key=images/foo.jpg  -> S3 (preferred)
// ?id=<google-drive-id> -> Google Drive (legacy, kept so testimonial and
//                          gallery links that still point at Drive keep working
//                          until those files are moved into the bucket)
import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { IMAGE_PREFIX, S3_BUCKET, isSafeKey, s3, s3Configured } from '@/lib/s3'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')

  if (key) {
    if (!isSafeKey(key, IMAGE_PREFIX)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }
    if (!s3Configured()) {
      return NextResponse.json({ error: 'Storage is not configured' }, { status: 500 })
    }

    try {
      const url = await getSignedUrl(
        s3(),
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
        { expiresIn: 60 * 60 }
      )
      return NextResponse.redirect(url, {
        status: 307,
        headers: { 'Cache-Control': 'private, max-age=600' },
      })
    } catch (error) {
      console.error('Presigning image failed', key, error)
      return NextResponse.json({ error: 'Image unavailable' }, { status: 502 })
    }
  }

  // ---- legacy Google Drive path ----
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing key or id' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://drive.google.com/uc?export=view&id=${id}`)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Drive' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await res.arrayBuffer()
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error', detail: `${e}` }, { status: 500 })
  }
}
