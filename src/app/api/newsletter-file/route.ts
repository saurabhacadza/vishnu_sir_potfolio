// src/app/api/newsletter-file/route.ts
// Hands out a short-lived presigned S3 URL for a newsletter PDF and redirects
// to it. The bytes go straight from S3 to the browser, so large issues don't
// stream through the server, and the PDF viewer still gets range requests.
import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NEWSLETTER_PREFIX, S3_BUCKET, isSafeKey, s3, s3Configured, titleFromKey } from '@/lib/s3'

export const dynamic = 'force-dynamic'

const URL_TTL_SECONDS = 60 * 15

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key || !isSafeKey(key, NEWSLETTER_PREFIX) || !/\.pdf$/i.test(key)) {
    return NextResponse.json({ error: 'Missing or invalid key' }, { status: 400 })
  }

  if (!s3Configured()) {
    return NextResponse.json({ error: 'Storage is not configured' }, { status: 500 })
  }

  // ?download=1 makes the browser save the file instead of rendering it.
  const download = req.nextUrl.searchParams.get('download') === '1'
  const filename = `${titleFromKey(key)}.pdf`.replace(/"/g, '')

  try {
    const url = await getSignedUrl(
      s3(),
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ResponseContentType: 'application/pdf',
        ResponseContentDisposition: download
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
      }),
      { expiresIn: URL_TTL_SECONDS }
    )

    return NextResponse.redirect(url, {
      status: 307,
      // Never let a CDN cache the redirect longer than the URL stays valid.
      headers: { 'Cache-Control': 'private, max-age=60' },
    })
  } catch (error) {
    console.error('Presigning newsletter file failed', key, error)
    return NextResponse.json({ error: 'Unable to open this issue' }, { status: 502 })
  }
}
