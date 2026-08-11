// src/lib/drive.ts
// Extract a Google Drive file ID and build our proxy URL safely.

export const driveId = (url: string): string | null => {
  if (!url) return null;
  return url.match(/(?:\/file\/d\/|[?&]id=)([A-Za-z0-9_-]{10,})/i)?.[1] ?? null;
};

export const driveProxy = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const s = urlOrId.trim();

  // Only treat it as an ID if the *entire string* is an ID
  const pureId = /^[A-Za-z0-9_-]{10,}$/.test(s) ? s : driveId(s);

  // If we got an ID, use the proxy; otherwise fall back to original string
  return pureId ? `/api/drive-image?id=${pureId}` : s;
};
