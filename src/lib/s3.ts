// src/lib/s3.ts
// Shared S3 client and bucket config.
//
// Credentials are NOT read from env vars. On Amplify the SDK picks up
// temporary credentials from the SSR Compute role; locally it falls back to
// your usual AWS profile. Never put AWS keys in this repo.
import { S3Client } from '@aws-sdk/client-s3'

export const S3_BUCKET = process.env.S3_BUCKET ?? ''

// AWS_REGION is set automatically in the Lambda runtime Amplify uses.
export const S3_REGION =
  process.env.S3_REGION ?? process.env.AWS_REGION ?? 'ap-south-1'

// Folder inside the bucket holding the newsletter PDFs.
export const NEWSLETTER_PREFIX = process.env.S3_NEWSLETTER_PREFIX ?? 'newsletters/'

// Folder inside the bucket holding site images.
export const IMAGE_PREFIX = process.env.S3_IMAGE_PREFIX ?? 'images/'

export const s3Configured = (): boolean => Boolean(S3_BUCKET)

let client: S3Client | null = null

export function s3(): S3Client {
  if (!client) client = new S3Client({ region: S3_REGION })
  return client
}

// Guard against reading arbitrary objects out of the bucket: a key must sit
// under an allowed prefix and must not try to climb out of it.
export function isSafeKey(key: string, prefix: string): boolean {
  if (!key || key.includes('..') || key.startsWith('/')) return false
  return key.startsWith(prefix)
}

// "newsletters/The_Thinking_Student_Vol-1.pdf" -> "The Thinking Student Vol-1"
export function titleFromKey(key: string): string {
  const base = key.slice(key.lastIndexOf('/') + 1)
  return base.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim()
}
