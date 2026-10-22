import type { RefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { motion } from '../../../motion/tokens';

export function playCatalogMotion(node: HTMLElement | null, frames: Keyframe[], options: KeyframeAnimationOptions) {
  if (!node || typeof node.animate !== 'function') return null;
  try { return node.animate(frames, options); } catch { return null; }
}

// Base styles are always visible. Cancelling, missing WAAPI or unmounting can
// never leave inline opacity/transform behind.
export function useCatalogFade(ref: RefObject<HTMLElement | null>, identity: unknown, enabled = true) {
  const reducedMotion = useReducedMotion();
  const previous = useRef(identity);
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const changed = previous.current !== identity;
    previous.current = identity;
    const node = ref.current;
    const opacity = node && animation.current?.playState === 'running'
      ? Math.max(.6, Number(getComputedStyle(node).opacity)) : .6;
    animation.current?.cancel();
    animation.current = null;
    if (!changed || !enabled || reducedMotion) return;
    animation.current = playCatalogMotion(node, [{ opacity }, { opacity: 1 }], {
      duration: motion.duration.fast, easing: motion.easing.enter,
    });
  }, [identity, enabled, reducedMotion, ref]);
  useLayoutEffect(() => () => { animation.current?.cancel(); }, []);
}

export function useCatalogResultsMotion(ref: RefObject<HTMLElement | null>, view: string, empty: boolean, ready: boolean) {
  const reducedMotion = useReducedMotion();
  const previous = useRef({ view, empty, ready });
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = { view, empty, ready };
    animation.current?.cancel();
    animation.current = null;
    if (reducedMotion || !ready || !before.ready) return;
    const viewChanged = before.view !== view;
    if (!viewChanged && (!empty || before.empty === empty)) return;
    animation.current = playCatalogMotion(ref.current,
      viewChanged ? [
        { opacity: .65, transform: `translateY(${motion.distance.control}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ] : [{ opacity: .6 }, { opacity: 1 }], {
        duration: viewChanged ? motion.duration.standard : motion.duration.fast,
        easing: motion.easing.enter,
      });
  }, [view, empty, ready, reducedMotion, ref]);
  useLayoutEffect(() => () => { animation.current?.cancel(); }, []);
}
