'use client';

import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<
  T extends HTMLElement,
  I extends HTMLElement = HTMLElement
>(onOutside: () => void, enabled = true, ignoreRefs: RefObject<I>[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handle = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      const el = ref.current;
      if (!el || !target) return;

      if (el.contains(target)) return; // clicked inside panel

      const clickedIgnored = ignoreRefs.some((r) => {
        const n = r.current as unknown as Node | null;
        return !!(n && target && n.contains(target));
      });

      if (!clickedIgnored) onOutside();
    };

    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onOutside();

    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle, { passive: true });
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
      document.removeEventListener('keydown', onEsc);
    };
  }, [enabled, ignoreRefs, onOutside]);

  return ref;
}
