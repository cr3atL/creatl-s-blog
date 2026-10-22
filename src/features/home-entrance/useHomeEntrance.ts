import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

const storageKey = 'creatl.homeEntrance.seen.v1';
let memorySeen = false;

const hasSeenEntrance = () => {
  try { return window.sessionStorage.getItem(storageKey) === '1'; }
  catch { return memorySeen; }
};
const rememberEntrance = () => {
  memorySeen = true;
  try { window.sessionStorage.setItem(storageKey, '1'); } catch { /* In-memory fallback. */ }
};

export default function useHomeEntrance(homeRef: RefObject<HTMLDivElement | null>) {
  const reducedMotion = useReducedMotion();
  const eligible = useRef<boolean | null>(null);
  const finished = useRef(false);

  useLayoutEffect(() => {
    if (eligible.current === null) {
      eligible.current = !hasSeenEntrance();
      rememberEntrance();
    }
    if (!eligible.current || finished.current) return;
    const home = homeRef.current;
    const logo = home?.querySelector<HTMLImageElement>('.archive-hero__logo');
    if (!home || !logo || typeof logo.animate !== 'function') return;
    const scope = home.closest<HTMLElement>('.shell-root') || home;
    if (reducedMotion) {
      finished.current = true;
      const fade = home.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120 });
      return () => fade.cancel();
    }
    // Restored scroll positions and anchored links take priority over an opening scene.
    if (window.scrollY > 0 || window.location.hash) { finished.current = true; return; }

    let disposed = false;
    const animations: Animation[] = [];
    const timers: number[] = [];
    const stage = document.createElement('div');
    stage.className = 'home-entrance';
    stage.setAttribute('aria-hidden', 'true');
    const backdrop = document.createElement('div');
    backdrop.className = 'home-entrance__backdrop';
    const flyingLogo = logo.cloneNode() as HTMLImageElement;
    flyingLogo.className = 'home-entrance__logo';
    flyingLogo.alt = '';
    stage.append(backdrop, flyingLogo);
    scope.dataset.homeEntering = 'true';
    document.body.append(stage);

    const events = ['pointerdown', 'keydown', 'focusin', 'wheel', 'touchstart', 'scroll', 'resize'] as const;
    const clean = () => {
      disposed = true;
      timers.forEach(timer => window.clearTimeout(timer));
      animations.forEach(animation => animation.cancel());
      delete scope.dataset.homeEntering;
      stage.remove();
      events.forEach(event => window.removeEventListener(event, finish, true));
    };
    const finish = () => { finished.current = true; clean(); };
    events.forEach(event => window.addEventListener(event, finish, { capture: true, passive: true }));
    const decodeTimeout = window.setTimeout(finish, 1000);
    timers.push(decodeTimeout);

    const play = () => {
      if (disposed) return;
      window.clearTimeout(decodeTimeout);
      const rect = logo.getBoundingClientRect();
      if (!rect.width || !rect.height) { finish(); return; }
      const scale = Math.min(600, window.innerWidth * .78) / rect.width;
      const pace = window.innerWidth < 768 ? .85 : 1;
      const x = window.innerWidth / 2 - rect.left - rect.width / 2;
      const y = window.innerHeight / 2 - rect.top - rect.height / 2;
      Object.assign(flyingLogo.style, {
        left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
      });
      const centered = `translate(${x}px, ${y}px) scale(${scale})`;
      animations.push(flyingLogo.animate([
        { opacity: 0, transform: `translate(${x}px, ${y + 12}px) scale(${scale * .98})`, filter: 'brightness(1)', offset: 0, easing: 'cubic-bezier(.2, .7, .2, 1)' },
        { opacity: 1, transform: centered, filter: 'brightness(1)', offset: .2 },
        { opacity: 1, transform: centered, filter: 'brightness(1.12) saturate(1.12)', offset: .34 },
        { opacity: 1, transform: centered, filter: 'brightness(1)', offset: .48 },
        { opacity: 1, transform: centered, filter: 'brightness(1)', offset: .6, easing: 'cubic-bezier(.42, 0, .2, 1)' },
        { opacity: 1, transform: 'none', filter: 'brightness(1)', offset: 1 },
      ], { duration: 1800 * pace, easing: 'linear', fill: 'both' }));
      animations.push(backdrop.animate([
        { opacity: 1, offset: 0 }, { opacity: 1, offset: .55 }, { opacity: 0, offset: 1 },
      ], { duration: 1800 * pace, fill: 'both' }));

      const reveal = (element: Element, delay: number) => {
        animations.push(element.animate([
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'none' },
        ], { delay: delay * pace, duration: 360 * pace, easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'both' }));
      };
      scope.querySelectorAll('.shell-header').forEach(element => reveal(element, 1180));
      home.querySelectorAll('.archive-hero h1, .archive-hero__intro, .archive-hero__social').forEach((element, i) => reveal(element, 1280 + i * 100));
      home.querySelectorAll('.content-selector__heading').forEach(element => reveal(element, 1360));
      home.querySelectorAll('.content-selector__row').forEach((element, i) => reveal(element, element.classList.contains('is-selected') ? 1730 : 1420 + i * 60));
      home.querySelectorAll('.home-updates').forEach(element => reveal(element, 1800));
      scope.querySelectorAll('.shell-footer').forEach(element => reveal(element, 1840));
      timers.push(window.setTimeout(finish, 2220 * pace));
    };
    // Decode the original asset before moving it; failure leaves the normal page usable.
    const ready = typeof logo.decode === 'function' ? logo.decode() : Promise.resolve();
    ready.then(play, finish);
    return clean;
  }, [homeRef, reducedMotion]);
}
