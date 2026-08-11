// Simple helpers to normalize YouTube & Google Drive links for embedding

const YT_REGEXES = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
];

export function getYouTubeId(url: string): string | null {
  for (const r of YT_REGEXES) {
    const m = url.match(r);
    if (m?.[1]) return m[1];
  }
  return null;
}

// Drive file id can appear in multiple formats:
// - https://drive.google.com/file/d/<ID>/view?usp=sharing
// - https://drive.google.com/open?id=<ID>
// - https://drive.google.com/uc?id=<ID>&export=download
const DRIVE_ID_RX =
  /(?:\/file\/d\/|[?&]id=|\/uc\?id=|\/thumbnail\?id=)([A-Za-z0-9_-]{10,})/i;
export function getDriveId(url: string): string | null {
  const m = url.match(DRIVE_ID_RX);
  return m?.[1] || null;
}

export function drivePreviewUrl(id: string): string {
  // For videos and docs preview in iframe
  return `https://drive.google.com/file/d/${id}/preview`;
}
export function driveImageUrl(id: string): string {
  // Direct image view (works if file is shared "Anyone with the link")
  return `https://drive.google.com/uc?export=view&id=${id}`;
}
export function driveThumbnailUrl(id: string, w = 1200): string {
  // Drive will serve a thumbnail; works for many file types
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
}

export function classifyUrl(url: string): { kind: 'youtube'|'drive'|'direct'|null; id?: string } {
  if (!url) return { kind: null };
  const yt = getYouTubeId(url);
  if (yt) return { kind: 'youtube', id: yt };
  const gd = getDriveId(url);
  if (gd) return { kind: 'drive', id: gd };
  try {
    // crude check for http(s)
    const u = new URL(url);
    if (u.protocol === 'http:' || u.protocol === 'https:') return { kind: 'direct' };
  } catch {}
  return { kind: null };
}