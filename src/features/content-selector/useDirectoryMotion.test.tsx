import { StrictMode, useRef } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentSelector from './ContentSelector';
import useDirectoryMotion from './useDirectoryMotion';

vi.mock('../../utils/analytics', () => ({ trackEvent: vi.fn() }));
type TrackedAnimation = { target: HTMLElement; frames: Keyframe[]; options: KeyframeAnimationOptions; cancel: ReturnType<typeof vi.fn>; onfinish: (() => void) | null };
const animations: TrackedAnimation[] = [];
const listeners = new Set<(event: { matches: boolean }) => void>();
const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
beforeEach(() => {
  animations.length = 0; listeners.clear(); media.matches = false;
  media.addEventListener = vi.fn((_event, callback) => listeners.add(callback));
  media.removeEventListener = vi.fn((_event, callback) => listeners.delete(callback));
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: vi.fn(function (this: HTMLElement, frames, options) {
    const animation = { target: this, frames, options, cancel: vi.fn(), onfinish: null }; animations.push(animation); return animation;
  }) });
});
afterEach(() => { vi.unstubAllGlobals(); delete (HTMLElement.prototype as Partial<HTMLElement>).animate; });
const setup = () => render(<MemoryRouter><ContentSelector /></MemoryRouter>);

test('immediately exposes only the new directory, restores focus, and keeps outgoing pixels inert', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: '音游曲库' }));
  const current = screen.getByRole('list', { name: '音游曲库' });
  expect(within(current).getAllByRole('link')).toHaveLength(3);
  expect(screen.queryByRole('button', { name: '小工具' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
  const ghost = document.querySelector('.content-selector__ghost')!;
  expect(ghost).toHaveAttribute('aria-hidden', 'true');
  expect(ghost).toHaveAttribute('inert');
  expect(ghost.querySelectorAll('[tabindex="0"], [href]')).toHaveLength(0);
  expect(animations.map(animation => animation.options.duration)).toEqual([240, 240]);
  act(() => { animations[1].onfinish?.(); });
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
});

test('rapid directory changes discard old visuals without delaying return or the next input', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: '音游曲库' }));
  fireEvent.keyDown(screen.getByRole('link', { name: 'maimai DX' }), { key: 'ArrowDown' });
  expect(screen.getByRole('link', { name: 'CHUNITHM' })).toHaveFocus();
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
  expect(animations.slice(0, 2).every(animation => animation.cancel.mock.calls.length)).toBe(true);
  fireEvent.keyDown(screen.getByRole('link', { name: 'CHUNITHM' }), { key: 'ArrowLeft' });
  expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: '小工具' }));
  expect(screen.getByRole('link', { name: '随机兔子图片' })).toHaveFocus();
  expect(document.querySelectorAll('.content-selector__ghost')).toHaveLength(1);
  expect(screen.getAllByRole('list')).toHaveLength(1);
});

test('preference changes and unmount immediately remove visuals and cancel animation handles', () => {
  const view = setup();
  fireEvent.click(screen.getByRole('button', { name: '音游曲库' }));
  act(() => { media.matches = true; listeners.forEach(listener => listener({ matches: true })); });
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
  expect(animations.every(animation => animation.cancel.mock.calls.length)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: '返回' }));
  expect(animations).toHaveLength(2);
  view.unmount(); expect(listeners.size).toBe(0);
});

test('StrictMode has no first-mount directory entrance and unmount cleans up a running replacement', () => {
  const view = render(<StrictMode><MemoryRouter><ContentSelector /></MemoryRouter></StrictMode>);
  expect(animations).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: '音游曲库' }));
  view.unmount();
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
  expect(animations.every(animation => animation.cancel.mock.calls.length)).toBe(true);
});

test('failed WAAPI never retains an outgoing accessible list or hides the current one', () => {
  vi.mocked(HTMLElement.prototype.animate).mockImplementation(() => { throw new Error('unavailable'); });
  setup(); fireEvent.click(screen.getByRole('button', { name: '音游曲库' }));
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
  expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
  const list = screen.getByRole('list', { name: '音游曲库' });
  expect(list.style.opacity).toBe('');
  expect(list.style.transform).toBe('');
  expect(list).not.toHaveAttribute('aria-hidden');
});

function HomeOpening({ folder = 'root' }) {
  const ref = useRef<HTMLUListElement>(null);
  useDirectoryMotion(ref, folder, 'entry');
  return <div className="shell-root" data-home-entering><div className="content-selector__stage"><ul ref={ref}><li>{folder}</li></ul></div></div>;
}
test('the approved home entrance remains the only animation while its marker is present', () => {
  const view = render(<HomeOpening />); view.rerender(<HomeOpening folder="catalog" />);
  expect(animations).toHaveLength(0);
  expect(document.querySelector('.content-selector__ghost')).toBeNull();
});
