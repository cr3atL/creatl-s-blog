import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';
import { motion } from './tokens';

/** Animate only the route body. Query and history state changes are deliberately absent. */
export default function usePageMotion(
  contentRef: RefObject<HTMLElement | null>,
  pathname: string,
) {
  const reducedMotion = useReducedMotion();
  const latestReducedMotion = useRef(reducedMotion);
  latestReducedMotion.current = reducedMotion;
  const active = useRef<Animation[]>([]);

  const cancel = () => {
    active.current.forEach(animation => animation.cancel());
    active.current = [];
  };

  useLayoutEffect(() => {
    let disposed = false;
    let interrupted = false;
    cancel();
    const currentContent = contentRef.current;
    const interrupt = () => { interrupted = true; cancel(); };
    const events = ['pointerdown', 'keydown', 'focusin', 'wheel', 'touchstart'] as const;
    events.forEach(event => currentContent?.addEventListener(event, interrupt, { passive: true }));
    // Home owns an outer layout effect. Its marker must be checked after all layout
    // effects, still before painting, rather than in the child's earlier effect.
    queueMicrotask(() => {
      const content = contentRef.current;
      if (disposed || interrupted || !content || latestReducedMotion.current) return;
      if (content.closest('.shell-root[data-home-entering]')) return;
      // The approved reduced-motion home entrance has no marker, only a short fade.
      const home = content.querySelector<HTMLElement>('.home-page');
      if (home?.getAnimations?.().some(animation =>
        animation.playState === 'running' || animation.pending)) return;

      const sections = Array.from(content.querySelectorAll<HTMLElement>('[data-motion-section]'))
        .filter(section => {
          const parentSection = section.parentElement?.closest('[data-motion-section]');
          return !parentSection || !content.contains(parentSection);
        });
      const targets = sections.length ? sections : [content];
      try {
        for (const [index, target] of targets.entries()) {
          if (typeof target.animate !== 'function') continue;
          active.current.push(target.animate([
            { opacity: 0, transform: `translateY(${motion.distance.page}px)` },
            { opacity: 1, transform: 'none' },
          ], {
            duration: motion.duration.slow,
            delay: Math.min(index * motion.stagger, motion.maxStagger),
            easing: motion.easing.enter,
            fill: 'backwards',
          }));
        }
      } catch {
        // No persistent style is applied: unsupported/failed WAAPI reveals the page.
        cancel();
      }
    });
    return () => {
      disposed = true;
      events.forEach(event => currentContent?.removeEventListener(event, interrupt));
      cancel();
    };
  }, [contentRef, pathname]);

  useLayoutEffect(() => {
    if (reducedMotion) cancel();
  }, [reducedMotion]);
}
