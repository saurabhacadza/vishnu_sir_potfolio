'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ScrollManager() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Disable native restoration
    if ('scrollRestoration' in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = 'manual';
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!el) return;
      const href = el.getAttribute('href') || '';
      if (!href.includes('#')) return;
      
      e.preventDefault();
      const id = href.split('#')[1];
      if (!id) return;

      const NAV_H = 72;
      // If we are NOT on the homepage, navigate there first with the hash
      if (pathname !== '/') {
        router.push(`/#${id}`);
        return;
      }
      // We are on '/', do smooth scroll
      const target = document.getElementById(id);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname, router]);

  useEffect(() => {
    // If page loads with a hash, offset scroll
    const { hash } = window.location;
    if (!hash) return;
    const id = hash.slice(1);
    const target = document.getElementById(id);
    const NAV_H = 72;
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return null;
}
