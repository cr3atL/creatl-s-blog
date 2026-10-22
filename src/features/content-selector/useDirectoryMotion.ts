import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { motion } from '../../motion/tokens';

/** Preserve only an inert visual snapshot while the live directory changes immediately. */
export default function useDirectoryMotion(
  listRef: RefObject<HTMLUListElement | null>,
  folder: string,
  selectedId: string,
) {
  const reducedMotion = useReducedMotion();
  const previous = useRef<{ folder: string; selectedId: string; visual: HTMLUListElement } | null>(null);
  const animations = useRef<Animation[]>([]);
  const ghost = useRef<HTMLUListElement | null>(null);

  const cancel = () => {
    animations.current.forEach(animation => {
      animation.onfinish = null;
      animation.cancel();
    });
    animations.current = [];
    ghost.current?.remove();
    ghost.current = null;
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const before = previous.current;
    const changedFolder = before && before.folder !== folder;
    if (changedFolder || (before && before.selectedId !== selectedId)) cancel();
    if (changedFolder && !reducedMotion && typeof list.animate === 'function'
      && !list.closest('.shell-root[data-home-entering]')) {
      const visual = before.visual;
      visual.classList.add('content-selector__ghost');
      visual.setAttribute('aria-hidden', 'true');
      visual.setAttribute('inert', '');
      visual.removeAttribute('aria-label');
      visual.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      visual.querySelectorAll<HTMLElement>('a, button, [tabindex]').forEach(element => {
        element.tabIndex = -1;
        element.removeAttribute('href');
      });
      ghost.current = visual;
      list.parentElement?.append(visual);
      try {
        animations.current.push(list.animate([
          { opacity: 0, transform: `translateY(${motion.distance.control}px)` },
          { opacity: 1, transform: 'none' },
        ], { duration: motion.duration.standard, easing: motion.easing.enter }));
        const outgoing = visual.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: motion.duration.standard, easing: motion.easing.exit,
        });
        animations.current.push(outgoing);
        outgoing.onfinish = cancel;
      } catch { cancel(); }
    }
    previous.current = { folder, selectedId, visual: list.cloneNode(true) as HTMLUListElement };
  });

  useLayoutEffect(() => {
    if (reducedMotion) cancel();
  }, [reducedMotion]);

  useLayoutEffect(() => () => { cancel(); previous.current = null; }, []);
}
