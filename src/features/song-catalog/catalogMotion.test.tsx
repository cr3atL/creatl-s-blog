import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { StrictMode, useRef, useState } from 'react';
import CatalogDialog from './components/CatalogDialog';
import SongSelectionView from './components/SongSelectionView';
import { useCatalogFade, useCatalogResultsMotion } from './hooks/useCatalogMotion';
import { motion } from '../../motion/tokens';
import { normalizeSongData } from './utils/normalizeSongData';
import { expandFilteredSongsToSheets } from './utils/filterSheets';
import { getSheetKey } from './utils/sheetIdentity';

interface Recording {
  node: HTMLElement;
  frames: Keyframe[];
  options: KeyframeAnimationOptions;
  playState: AnimationPlayState;
  cancel: ReturnType<typeof vi.fn>;
  onfinish: (() => void) | null;
}
let recordings: Recording[];
let preference: boolean;
let listeners: Set<(event: { matches: boolean }) => void>;
const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
beforeEach(() => {
  recordings = [];
  preference = false;
  listeners = new Set();
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    get matches() { return preference; },
    addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
  })));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: function (
    this: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions,
  ) {
    const record: Recording = { node: this, frames, options, playState: 'running',
      cancel: vi.fn(() => { record.playState = 'idle'; }), onfinish: null };
    recordings.push(record);
    return record;
  } });
});
afterEach(() => {
  if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate);
  else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  vi.unstubAllGlobals();
});
function setPreference(matches: boolean) {
  act(() => { preference = matches; listeners.forEach((listener) => listener({ matches })); });
}
function Dialog({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)}>打开</button>
    <button>后续操作</button>
    <CatalogDialog open={open} onClose={() => { setOpen(false); onClose(); }} label="筛选条件" className="song-catalog-filter">
      <button onClick={() => { setOpen(false); onClose(); }}>关闭</button>
    </CatalogDialog>
  </>;
}
function openDialog() {
  const trigger = screen.getByRole('button', { name: '打开' });
  trigger.focus(); fireEvent.click(trigger);
  return trigger;
}

test('closing immediately releases focus and semantics while the visual exit is inert', () => {
  const close = vi.fn();
  render(<Dialog onClose={close} />);
  const trigger = openDialog();
  expect(screen.getByRole('button', { name: '关闭' })).toHaveFocus();
  expect(recordings[0].options.duration).toBe(motion.duration.standard);
  expect(recordings[1].frames[0].transform).toBe('scale(.98)');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  const exit = document.querySelector('[data-catalog-dialog-state="exiting"]')!;
  expect(exit).toHaveAttribute('inert');
  expect(exit).toHaveAttribute('aria-hidden', 'true');
  expect(recordings.at(-2)!.options.duration).toBe(motion.duration.fast);
  fireEvent.click(within(exit as HTMLElement).getByText('关闭'));
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(close).toHaveBeenCalledTimes(1);
  screen.getByRole('button', { name: '后续操作' }).focus();
  expect(screen.getByRole('button', { name: '后续操作' })).toHaveFocus();
  act(() => recordings.at(-2)!.onfinish?.());
  expect(document.querySelector('[data-catalog-dialog-state]')).toBeNull();
});

test('quick reopening cancels old exit and a late finish cannot remove the new dialog', () => {
  const { unmount } = render(<Dialog />);
  const trigger = openDialog();
  fireEvent.click(screen.getByRole('button', { name: '关闭' }));
  const exitMask = recordings.at(-2)!;
  const oldFinish = exitMask.onfinish!;
  fireEvent.click(trigger);
  expect(exitMask.cancel).toHaveBeenCalled();
  act(() => oldFinish());
  expect(screen.getByRole('dialog', { name: '筛选条件' })).toHaveAttribute('data-catalog-dialog-state', 'open');
  expect(screen.getByRole('button', { name: '关闭' })).toHaveFocus();
  unmount();
  expect(recordings.every((record) => record.cancel.mock.calls.length > 0)).toBe(true);
});

test('live reduced motion cancels running dialog motion and closes without a retained exit', () => {
  render(<Dialog />);
  const trigger = openDialog();
  const count = recordings.length;
  setPreference(true);
  expect(recordings.every((record) => record.cancel.mock.calls.length > 0)).toBe(true);
  expect(screen.getByRole('dialog')).toBeVisible();
  setPreference(false);
  expect(recordings).toHaveLength(count);
  setPreference(true);
  fireEvent.click(screen.getByRole('button', { name: '关闭' }));
  expect(trigger).toHaveFocus();
  expect(document.querySelector('[data-catalog-dialog-state]')).toBeNull();
});

test('StrictMode and missing or failing WAAPI leave dialog content usable', () => {
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: () => { throw new Error('unavailable'); } });
  const { unmount } = render(<StrictMode><Dialog /></StrictMode>);
  const trigger = openDialog();
  expect(screen.getByRole('dialog')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '关闭' }));
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  unmount();
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: undefined });
  render(<Dialog />);
  openDialog();
  expect(screen.getByRole('dialog')).toBeVisible();
});

function Fade({ value = 0, enabled = true }) {
  const ref = useRef<HTMLDivElement>(null);
  useCatalogFade(ref, value, enabled);
  return <div ref={ref}>{value}</div>;
}
test('rapid preview changes replace previous fades, and reduced motion/unmount cancel them', () => {
  const { rerender, unmount } = render(<Fade />);
  expect(recordings).toHaveLength(0);
  rerender(<Fade value={1} />);
  const first = recordings[0];
  rerender(<Fade value={2} />);
  expect(first.cancel).toHaveBeenCalled();
  expect(screen.getByText('2')).toBeVisible();
  setPreference(true);
  expect(recordings.at(-1)!.cancel).toHaveBeenCalled();
  rerender(<Fade value={3} />);
  expect(recordings).toHaveLength(2);
  expect(screen.getByText('3')).toBeVisible();
  unmount();
});

function Results({ view = 'selection', empty = false, query = '' }) {
  const ref = useRef<HTMLDivElement>(null);
  useCatalogResultsMotion(ref, view, empty, true);
  return <div ref={ref}>{view} {query}</div>;
}
test('view motion is local and cancels cleanly; queries do not replay it and empty feedback only fades', () => {
  const { rerender, unmount } = render(<Results />);
  rerender(<Results query="sort/filters" />);
  expect(recordings).toHaveLength(0);
  rerender(<Results view="grid" />);
  expect(recordings[0].options.duration).toBe(motion.duration.standard);
  rerender(<Results view="summary" />);
  expect(recordings[0].cancel).toHaveBeenCalled();
  rerender(<Results view="summary" empty />);
  expect(recordings.at(-1)!.options.duration).toBe(motion.duration.fast);
  expect(recordings.at(-1)!.frames.every((frame) => !('transform' in frame))).toBe(true);
  unmount();
  expect(recordings.every((record) => record.cancel.mock.calls.length > 0)).toBe(true);
});

const sheets = expandFilteredSongsToSheets(normalizeSongData({ songs: Array.from({ length: 200 }, (_, i) => ({
  songId: `song-${i}`, title: `Song ${i}`, sheets: [{ id: 'basic', difficulty: 'BASIC', level: '4' }],
})) }, 'https://example.test').songs);
function Selection() {
  const [selected, setSelected] = useState(getSheetKey(sheets[0], 'maimai'));
  return <SongSelectionView gameId="maimai" sheets={sheets} selectedKey={selected} onSelect={setSelected} onOpen={() => {}} />;
}
test('selection moves one visible window, cancels on native scroll, and never animates individual rows', () => {
  const { unmount } = render(<StrictMode><Selection /></StrictMode>);
  const list = screen.getByRole('listbox');
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  const movement = recordings.find((record) => record.node.classList.contains('song-selection__window'))!;
  expect(movement.options.duration).toBe(motion.duration.fast);
  fireEvent.scroll(list, { target: { scrollTop: 48 } });
  expect(movement.cancel).not.toHaveBeenCalled();
  const count = recordings.length;
  fireEvent.scroll(list, { target: { scrollTop: 480 } });
  expect(movement.cancel).toHaveBeenCalled();
  expect(recordings).toHaveLength(count);
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  expect(within(list).getByRole('option', { selected: true })).toHaveAttribute('aria-posinset', '13');
  expect(document.getElementById(list.getAttribute('aria-activedescendant')!)).not.toBeNull();
  expect(within(list).getAllByRole('option').length).toBeLessThanOrEqual(19);
  expect(recordings.some((record) => record.node.matches('[role="option"]'))).toBe(false);
  setPreference(true);
  const reducedCount = recordings.length;
  fireEvent.keyDown(list, { key: 'End' });
  expect(recordings).toHaveLength(reducedCount);
  unmount();
  expect(recordings.every((record) => record.cancel.mock.calls.length > 0)).toBe(true);
});
