import { useLayoutEffect, useRef } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';
import { motion } from '../motion/tokens';

/** Leave pixels behind, not a live focus trap, when the mobile drawer closes. */
export default function useNavigationExit() {
  const reducedMotion = useReducedMotion();
  const visual = useRef<HTMLElement | null>(null);
  const animations = useRef<Animation[]>([]);

  const cancel = () => {
    animations.current.forEach(animation => { animation.onfinish = null; animation.cancel(); });
    animations.current = [];
    visual.current?.remove();
    visual.current = null;
  };

  const leave = (source: HTMLElement | null) => {
    cancel();
    if (reducedMotion || !source || typeof source.animate !== 'function') return;
    const sourcePanel = source.querySelector<HTMLElement>('.ant-drawer-content-wrapper');
    const sourceMask = source.querySelector<HTMLElement>('.ant-drawer-mask');
    if (!sourcePanel) return;
    const panelTransform = getComputedStyle(sourcePanel).transform;
    const maskOpacity = sourceMask ? getComputedStyle(sourceMask).opacity : '1';
    const clone = source.cloneNode(true) as HTMLElement;
    clone.classList.add('shell-navigation-exit');
    clone.classList.remove('shell-navigation-drawer');
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('inert', '');
    clone.removeAttribute('id');
    clone.querySelectorAll<HTMLElement>('*').forEach(element => {
      element.removeAttribute('id');
      element.removeAttribute('href');
      if (element.matches('a, button, [tabindex]')) element.tabIndex = -1;
      Array.from(element.classList).filter(name => /-(appear|enter|leave)(-|$)/.test(name))
        .forEach(name => element.classList.remove(name));
    });
    visual.current = clone;
    document.body.append(clone);
    try {
      const mask = clone.querySelector<HTMLElement>('.ant-drawer-mask');
      if (mask) animations.current.push(mask.animate([{ opacity: maskOpacity }, { opacity: 0 }], {
        duration: motion.duration.fast, easing: motion.easing.exit, fill: 'forwards',
      }));
      const panel = clone.querySelector<HTMLElement>('.ant-drawer-content-wrapper')!;
      const exit = panel.animate([{ transform: panelTransform }, { transform: 'translateX(100%)' }], {
        duration: motion.duration.slow, easing: motion.easing.exit,
      });
      animations.current.push(exit);
      exit.onfinish = cancel;
    } catch { cancel(); }
  };

  useLayoutEffect(() => { if (reducedMotion) cancel(); }, [reducedMotion]);
  useLayoutEffect(() => cancel, []);
  return { leave, cancel };
}
