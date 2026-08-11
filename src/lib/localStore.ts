// lib/localStore.ts
import type { Testimonial } from './testimonials';

const DB_NAME = 'rewise-testimonials';
const DB_VER = 1;
export const TESTIMONIALS_EVENT = 'rw-testimonials-change';

// localStorage folder-like keys
const ROOT = 'testimonials';
const KEY_ITEMS = `${ROOT}/items`; // JSON array of Testimonial
const KEY_HIDDEN = `${ROOT}/hidden`; // JSON array of testimonial IDs hidden from view
const KEY_IMG = (id: string) => `${ROOT}/images/${id}`;
const KEY_VTH = (id: string) => `${ROOT}/videos/thumbs/${id}`;

export function genId() {
  return 't_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ---------------- IndexedDB helpers (folders = object stores) --------------- */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('images')) db.createObjectStore('images', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('videos')) db.createObjectStore('videos', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut(store: 'images'|'videos', id: string, blob: Blob, mime?: string) {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put({ id, blob, mime: mime || blob.type || '' });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGet(store: 'images'|'videos', id: string): Promise<{ blob: Blob, mime: string } | undefined> {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result as any);
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(store: 'images'|'videos', id: string) {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------------- localStorage JSON index ---------------------------------- */

function loadAll(): Testimonial[] {
  try {
    const raw = localStorage.getItem(KEY_ITEMS);
    return raw ? JSON.parse(raw) as Testimonial[] : [];
  } catch { return []; }
}

function saveAll(items: Testimonial[]) {
  try { localStorage.setItem(KEY_ITEMS, JSON.stringify(items)); } catch {}
  notifyChange();
}

function loadHidden(): string[] {
  try {
    const raw = localStorage.getItem(KEY_HIDDEN);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHidden(ids: string[]) {
  try { localStorage.setItem(KEY_HIDDEN, JSON.stringify(ids)); } catch {}
  notifyChange();
}

/* ---------------- file-like “folders” in localStorage ---------------------- */

function saveImageData(id: string, dataUrl: string) {
  try { localStorage.setItem(KEY_IMG(id), dataUrl); } catch {}
}
function readImageData(id: string) {
  try { return localStorage.getItem(KEY_IMG(id)) || undefined; } catch { return undefined; }
}

function saveVideoThumb(id: string, dataUrl: string) {
  try { localStorage.setItem(KEY_VTH(id), dataUrl); } catch {}
}
function readVideoThumb(id: string) {
  try { return localStorage.getItem(KEY_VTH(id)) || undefined; } catch { return undefined; }
}

/* ---------------- utilities ------------------------------------------------ */

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

function youtubeId(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || undefined;
  } catch {}
  return undefined;
}

const localStore = {
  genId,
  dbPut,
  dbGet,
  dbDelete,
  loadAll,
  saveAll,
  loadHidden,
  saveHidden,
  saveImageData,
  readImageData,
  saveVideoThumb,
  readVideoThumb,
  fileToDataUrl,
  youtubeId,
  async removeTestimonials(records: Testimonial[]) {
    if (!records.length) return loadAll();
    const ids = new Set(records.map(r => r.id));
    const remaining = loadAll().filter(t => !ids.has(t.id));
    saveAll(remaining);
    await Promise.all(records.map(async (r) => {
      try { localStorage.removeItem(KEY_IMG(r.id)); } catch {}
      try { localStorage.removeItem(KEY_VTH(r.id)); } catch {}
      if (r.image?.blobId) {
        try { await dbDelete('images', r.image.blobId); } catch {}
      }
    }));
    notifyChange();
    return remaining;
  },
  notifyChange,
  changeEvent: TESTIMONIALS_EVENT,
};

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(TESTIMONIALS_EVENT));
  }
}

export default localStore;
