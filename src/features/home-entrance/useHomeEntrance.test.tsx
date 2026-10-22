import { StrictMode, useRef } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import useHomeEntrance from './useHomeEntrance';

const storageKey = 'creatl.homeEntrance.seen.v1';
const animations: { cancel: ReturnType<typeof vi.fn> }[] = [];
let reduceMotion = false;

function HomeScene() {
  const ref = useRef<HTMLDivElement>(null);
  useHomeEntrance(ref);
  return <div className="shell-root"><header className="shell-header">导航</header>
    <div ref={ref}><img className="archive-hero__logo" alt="creatL" /><button>打开目录</button></div>
  </div>;
}
const flushDecode = async () => { await act(async () => { await Promise.resolve(); }); };

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
  animations.length = 0;
  reduceMotion = false;
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduceMotion, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ x: 40, y: 150, left: 40, top: 150, right: 340, bottom: 272, width: 300, height: 122, toJSON: () => ({}) });
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: vi.fn(() => {
    const animation = { cancel: vi.fn() }; animations.push(animation); return animation;
  }) });
  Object.defineProperty(HTMLImageElement.prototype, 'decode', { configurable: true, value: vi.fn(() => Promise.resolve()) });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
  delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).decode;
});

test('plays once, clears the scene, and does not replay on return or reload', async () => {
  const first = render(<HomeScene />);
  await flushDecode();
  expect(document.querySelector('.home-entrance')).toHaveAttribute('aria-hidden', 'true');
  expect(window.sessionStorage.getItem(storageKey)).toBe('1');
  act(() => { vi.advanceTimersByTime(2100); });
  expect(document.querySelector('.home-entrance')).not.toBeNull();
  act(() => { vi.advanceTimersByTime(200); });
  expect(document.querySelector('.home-entrance')).toBeNull();
  expect(first.container.querySelector('[data-home-entering]')).toBeNull();
  expect(animations.every(animation => animation.cancel.mock.calls.length > 0)).toBe(true);
  first.unmount();
  const count = animations.length;
  render(<HomeScene />);
  await flushDecode();
  expect(animations).toHaveLength(count);
  expect(document.querySelector('.home-entrance')).toBeNull();
});

test('survives StrictMode effect cleanup and removes its scene on unmount', async () => {
  const view = render(<StrictMode><HomeScene /></StrictMode>);
  await flushDecode();
  expect(document.querySelectorAll('.home-entrance')).toHaveLength(1);
  view.unmount();
  expect(document.querySelector('.home-entrance')).toBeNull();
  const cancellations = animations.map(animation => animation.cancel.mock.calls.length);
  act(() => { vi.runOnlyPendingTimers(); });
  expect(animations.map(animation => animation.cancel.mock.calls.length)).toEqual(cancellations);
  expect(document.querySelector('.home-entrance')).toBeNull();
});

test.each(['pointerdown', 'keydown', 'scroll', 'resize'])('%s immediately reveals the page', async event => {
  render(<HomeScene />);
  await flushDecode();
  fireEvent(window, new Event(event));
  expect(document.querySelector('.home-entrance')).toBeNull();
  expect(document.querySelector('[data-home-entering]')).toBeNull();
});

test('reduced motion uses a short fade with no central logo scene', async () => {
  reduceMotion = true;
  const view = render(<HomeScene />);
  await flushDecode();
  expect(document.querySelector('.home-entrance')).toBeNull();
  expect(animations).toHaveLength(1);
  view.unmount();
  expect(animations[0].cancel).toHaveBeenCalled();
});

test('a logo decode failure immediately leaves the page visible', async () => {
  vi.mocked(HTMLImageElement.prototype.decode).mockRejectedValue(new Error('image failed'));
  render(<HomeScene />);
  await flushDecode();
  expect(document.querySelector('.home-entrance')).toBeNull();
  expect(document.querySelector('[data-home-entering]')).toBeNull();
});
