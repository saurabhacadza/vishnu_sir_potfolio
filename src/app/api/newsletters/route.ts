// src/app/api/newsletters/route.ts
// Lists newsletter PDFs from the S3 bucket.
// Fetched fresh on every request, so new uploads appear instantly.
import { NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { NEWSLETTER_PREFIX, S3_BUCKET, s3, s3Configured, titleFromKey } from '@/lib/s3'

export const dynamic = 'force-dynamic'

export type NewsletterFile = {
  // The S3 object key. Named `id` so the client keeps working unchanged.
  id: string
  name: string
  title: string
  createdTime: string
  modifiedTime: string
  size?: string
}

export async function GET() {
  if (!s3Configured()) {
    return NextResponse.json(
      { success: false, error: 'Newsletter feed is not configured', newsletters: [] },
      { status: 500 }
    )
  }

  try {
    const res = await s3().send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: NEWSLETTER_PREFIX,
        MaxKeys: 100,
      })
    )

    const newsletters: NewsletterFile[] = (res.Contents ?? [])
      .filter((o) => o.Key && /\.pdf$/i.test(o.Key))
      .map((o) => {
        const key = o.Key as string
        // S3 has no separate creation date, so last-modified serves as both.
        const when = (o.LastModified ?? new Date()).toISOString()
        return {
          id: key,
          name: key.slice(key.lastIndexOf('/') + 1),
          title: titleFromKey(key),
          createdTime: when,
          modifiedTime: when,
          size: o.Size != null ? String(o.Size) : undefined,
        }
      })
      // Newest issue first, matching the old Drive ordering.
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

    return NextResponse.json(
      { success: true, newsletters },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('S3 newsletter list failed', error)
    return NextResponse.json(
      { success: false, error: 'Unable to load newsletters right now', newsletters: [] },
      { status: 502 }
    )
  }
}
