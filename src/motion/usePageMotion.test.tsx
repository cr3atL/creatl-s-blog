import { StrictMode, useLayoutEffect, useRef } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import usePageMotion from './usePageMotion';
import { motion } from './tokens';

type TrackedAnimation = { target: HTMLElement; frames: Keyframe[]; options: KeyframeAnimationOptions; cancel: ReturnType<typeof vi.fn> };
const animations: TrackedAnimation[] = [];
const listeners = new Set<(event: { matches: boolean }) => void>();
const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
const flush = () => act(async () => { await Promise.resolve(); });

function Scene({ pathname = '/article', lateHome = false, groups = false, nested = false }) {
  const ref = useRef<HTMLElement>(null);
  usePageMotion(ref, pathname);
  return <div className="shell-root"><header>导航</header><main ref={ref}>
    {lateHome ? <div className="home-page">首页</div> : groups ? <>
      <section data-motion-section>一{nested && <article data-motion-section>嵌套</article>}</section>
      <section data-motion-section>二</section><section data-motion-section>三</section><section data-motion-section>四</section>
    </> : <button>正文操作</button>}
  </main><footer>页尾</footer></div>;
}

function ParentEntrance() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.shell-root')!;
    root.dataset.homeEntering = 'true';
    return () => { delete root.dataset.homeEntering; };
  }, []);
  return <Scene pathname="/" lateHome />;
}

beforeEach(() => {
  animations.length = 0; listeners.clear(); media.matches = false;
  media.addEventListener = vi.fn((_event, callback) => listeners.add(callback));
  media.removeEventListener = vi.fn((_event, callback) => listeners.delete(callback));
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: vi.fn(function (this: HTMLElement, frames, options) {
    const animation = { target: this, frames, options, cancel: vi.fn() }; animations.push(animation); return animation;
  }) });
});
afterEach(() => { vi.unstubAllGlobals(); delete (HTMLElement.prototype as Partial<HTMLElement>).animate; });

test('uses top-level sections, caps stagger and leaves navigation and nested sections alone', async () => {
  render(<Scene groups nested />); await flush();
  expect(animations).toHaveLength(4);
  expect(animations.map(animation => animation.options.delay)).toEqual([0, 60, 120, 120]);
  expect(animations.every(animation => animation.options.duration === motion.duration.slow)).toBe(true);
  expect(animations[0].frames[0]).toEqual({ opacity: 0, transform: 'translateY(8px)' });
  expect(animations.some(animation => ['HEADER', 'FOOTER', 'ARTICLE'].includes(animation.target.tagName))).toBe(false);
});

test('falls back to the body and replays only when pathname changes', async () => {
  const view = render(<Scene />); await flush();
  expect(animations[0].target.tagName).toBe('MAIN');
  view.rerender(<Scene />); await flush();
  expect(animations).toHaveLength(1);
  view.rerender(<Scene pathname="/about" />); await flush();
  expect(animations[0].cancel).toHaveBeenCalled();
  expect(animations).toHaveLength(2);
});

test('the parent home layout effect takes priority before the queued page entrance', async () => {
  render(<ParentEntrance />); await flush();
  expect(document.querySelector('[data-home-entering]')).not.toBeNull();
  expect(animations).toHaveLength(0);
});

test('StrictMode and quick route replacement cancel pending work and clean up on unmount', async () => {
  const view = render(<StrictMode><Scene /></StrictMode>);
  view.rerender(<StrictMode><Scene pathname="/tools" /></StrictMode>);
  await flush();
  expect(animations).toHaveLength(1);
  view.unmount();
  expect(animations[0].cancel).toHaveBeenCalled();
  await flush(); expect(animations).toHaveLength(1);
});

test('unmounting before the microtask never starts an entrance', async () => {
  const view = render(<Scene />); view.unmount(); await flush();
  expect(animations).toHaveLength(0);
});

test.each(['pointerdown', 'keydown', 'focusin', 'wheel', 'touchstart'])('%s reveals the body immediately and removes the temporary transform', async event => {
  const view = render(<Scene />); await flush();
  fireEvent(view.container.querySelector('button')!, new Event(event, { bubbles: true }));
  expect(animations[0].cancel).toHaveBeenCalled();
  const calls = animations[0].cancel.mock.calls.length;
  view.unmount();
  fireEvent(view.container, new Event(event, { bubbles: true }));
  expect(animations[0].cancel).toHaveBeenCalledTimes(calls);
});

test('interaction before the microtask prevents an entrance from hiding a focused control', async () => {
  const view = render(<Scene />);
  fireEvent.focusIn(view.container.querySelector('button')!);
  await flush(); expect(animations).toHaveLength(0);
});

test('responds to reduced motion without replaying an old page when the preference changes back', async () => {
  const view = render(<Scene />); await flush();
  act(() => { media.matches = true; listeners.forEach(listener => listener({ matches: true })); });
  expect(animations[0].cancel).toHaveBeenCalled();
  act(() => { media.matches = false; listeners.forEach(listener => listener({ matches: false })); });
  await flush(); expect(animations).toHaveLength(1);
  view.unmount(); expect(listeners.size).toBe(0);
});

test('reduced-motion first render stays visible without moving', async () => {
  media.matches = true;
  const view = render(<Scene />); await flush();
  expect(animations).toHaveLength(0);
  expect(view.container.querySelector('main')).not.toHaveAttribute('style');
});

test('WAAPI failure cancels earlier groups and leaves no persistent opacity', async () => {
  const animate = vi.mocked(HTMLElement.prototype.animate);
  animate.mockImplementationOnce(function (this: HTMLElement, frames, options) {
    const animation = { target: this, frames, options, cancel: vi.fn() } as TrackedAnimation;
    animations.push(animation); return animation as unknown as Animation;
  }).mockImplementationOnce(() => { throw new Error('unavailable'); });
  const view = render(<Scene groups />); await flush();
  expect(animations[0].cancel).toHaveBeenCalled();
  expect(view.container.querySelector('main')).not.toHaveAttribute('style');
});
