import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which section is under the execution line — a band near the top of
 * the viewport. Scrolling a section into that band is what "executes" it, so
 * the rail's stack, scope and heap panels all follow from this one value.
 */
export function useActiveFrame(ids: string[]): [string | null, (id: string) => (el: HTMLElement | null) => void] {
  const [active, setActive] = useState<string | null>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const visible = useRef(new Map<string, number>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-frame-id');
          if (id) visible.current.set(id, entry.intersectionRatio);
        });

        // The first section in document order that is meaningfully on screen
        // wins, so scrolling down hands execution over cleanly.
        let next: string | null = null;
        let best = 0;
        ids.forEach((id) => {
          const ratio = visible.current.get(id) ?? 0;
          if (ratio > best + 0.001) {
            best = ratio;
            next = id;
          }
        });
        setActive(best > 0.02 ? next : null);
      },
      { rootMargin: '-12% 0px -55% 0px', threshold: [0, 0.02, 0.15, 0.4, 0.75, 1] },
    );

    els.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) els.current.set(id, el);
    else {
      els.current.delete(id);
      visible.current.delete(id);
    }
  };

  return [active, register];
}
