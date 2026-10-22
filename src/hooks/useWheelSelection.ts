import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

const STEP_PIXELS = 40;
const GESTURE_GAP_MS = 180;

/** Discrete selection for both mouse notches and small, cumulative trackpad deltas. */
export default function useWheelSelection<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onStep: (direction: 1 | -1) => void,
  { enabled = true, resetKey = '' } = {},
) {
  const latestStep = useRef(onStep);
  useLayoutEffect(() => { latestStep.current = onStep; });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    let accumulated = 0;
    let lastTime = 0;
    let lastDirection = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
        || !Number.isFinite(event.deltaY) || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      const direction = event.deltaY > 0 ? 1 : -1;
      if (now - lastTime > GESTURE_GAP_MS || direction !== lastDirection) accumulated = 0;
      lastTime = now;
      lastDirection = direction;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? STEP_PIXELS : 1;
      accumulated += Math.abs(event.deltaY) * unit;
      if (accumulated < STEP_PIXELS) return;
      // A single mouse notch often reports 100–120 px; it still selects only one item.
      accumulated = 0;
      latestStep.current(direction);
    };
    // React's delegated wheel listener is passive; selection must cancel native scrolling.
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [ref, enabled, resetKey]);
}
