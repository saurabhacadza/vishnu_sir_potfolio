// src/app/api/newsletter-upload/route.ts
// Uploads a newsletter PDF (and optionally its cover image) into the bucket.
//
// This endpoint writes to S3, so it is locked behind a shared token:
//   - send it as  x-upload-token: <token>  (or ?token=<token>)
//   - the token lives in the UPLOAD_TOKEN env var
//   - if UPLOAD_TOKEN is unset the route refuses every request, so the
//     endpoint is inert unless it has been deliberately switched on
//
// Two modes:
//   POST /api/newsletter-upload              multipart form, field "file"
//                                            (plus optional "cover")
//   POST /api/newsletter-upload?mode=presign JSON { filename, contentType }
//                                            -> presigned PUT url for big files
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NEWSLETTER_PREFIX, S3_BUCKET, s3, s3Configured } from '@/lib/s3'

export const dynamic = 'force-dynamic'

// Request bodies larger than this will not survive the serverless request
// limit, so reject them early with a message that explains the presign route.
const MAX_DIRECT_BYTES = 4 * 1024 * 1024

const COVER_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.UPLOAD_TOKEN
  if (!expected) return false
  const given =
    req.headers.get('x-upload-token') ?? req.nextUrl.searchParams.get('token') ?? ''
  // Lengths differ -> not equal; same length -> compare every byte.
  if (given.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

// "My Issue #2.pdf" -> "My_Issue_2.pdf"; never lets a key escape the prefix.
function safeName(raw: string): string | null {
  const base = raw.split(/[/\\]/).pop() ?? ''
  const cleaned = base
    .replace(/\.pdf$/i, '')
    .replace(/[^A-Za-z0-9._ -]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 120)
  return cleaned ? `${cleaned}.pdf` : null
}

function guard(req: NextRequest): NextResponse | null {
  if (!authorized(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: process.env.UPLOAD_TOKEN ? 401 : 503 }
    )
  }
  if (!s3Configured()) {
    return NextResponse.json({ success: false, error: 'Storage is not configured' }, { status: 500 })
  }
  return null
}

export async function POST(req: NextRequest) {
  const blocked = guard(req)
  if (blocked) return blocked

  if (req.nextUrl.searchParams.get('mode') === 'presign') return presign(req)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Expected a multipart form upload' },
      { status: 400 }
    )
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: 'No file uploaded (form field "file")' },
      { status: 400 }
    )
  }

  const name = safeName(file.name)
  if (!name) {
    return NextResponse.json({ success: false, error: 'Unusable file name' }, { status: 400 })
  }
  if (file.type && file.type !== 'application/pdf') {
    return NextResponse.json(
      { success: false, error: `Expected a PDF, got ${file.type}` },
      { status: 415 }
    )
  }
  if (file.size > MAX_DIRECT_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB; the direct upload limit is 4 MB. Use ?mode=presign for larger files.`,
      },
      { status: 413 }
    )
  }

  const key = `${NEWSLETTER_PREFIX}${name}`

  try {
    const body = new Uint8Array(await file.arrayBuffer())
    // Reject anything that isn't really a PDF, whatever the form claimed.
    if (body.length < 5 || Buffer.from(body.subarray(0, 5)).toString() !== '%PDF-') {
      return NextResponse.json(
        { success: false, error: 'That file is not a PDF' },
        { status: 415 }
      )
    }

    await s3().send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/pdf',
      })
    )

    // Optional cover image, stored beside the PDF under the same base name.
    let coverKey: string | undefined
    const cover = form.get('cover')
    if (cover instanceof File && cover.size > 0) {
      const ext = COVER_TYPES[cover.type]
      if (!ext) {
        return NextResponse.json(
          { success: false, error: `Cover must be JPEG, PNG or WebP (got ${cover.type})`, key },
          { status: 415 }
        )
      }
      coverKey = `${NEWSLETTER_PREFIX}${name.replace(/\.pdf$/i, '')}${ext}`
      await s3().send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: coverKey,
          Body: new Uint8Array(await cover.arrayBuffer()),
          ContentType: cover.type,
        })
      )
    }

    return NextResponse.json({
      success: true,
      key,
      coverKey,
      bucket: S3_BUCKET,
      size: file.size,
      viewUrl: `/api/newsletter-file?key=${encodeURIComponent(key)}`,
      thumbUrl: `/api/newsletter-thumb?key=${encodeURIComponent(key)}`,
    })
  } catch (error) {
    console.error('Newsletter upload failed', key, error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 502 })
  }
}

// Hands back a presigned PUT url so the browser can send big files straight
// to S3 without the bytes passing through this server.
async function presign(req: NextRequest) {
  let payload: { filename?: string; contentType?: string }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body' }, { status: 400 })
  }

  const name = safeName(payload.filename ?? '')
  if (!name) {
    return NextResponse.json({ success: false, error: 'Missing or unusable filename' }, { status: 400 })
  }
  if (payload.contentType && payload.contentType !== 'application/pdf') {
    return NextResponse.json({ success: false, error: 'Expected application/pdf' }, { status: 415 })
  }

  const key = `${NEWSLETTER_PREFIX}${name}`

  try {
    const uploadUrl = await getSignedUrl(
      s3(),
      new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, ContentType: 'application/pdf' }),
      { expiresIn: 60 * 10 }
    )
    return NextResponse.json({ success: true, key, uploadUrl, expiresIn: 600 })
  } catch (error) {
    console.error('Presigning upload failed', key, error)
    return NextResponse.json({ success: false, error: 'Could not start upload' }, { status: 502 })
  }
}
