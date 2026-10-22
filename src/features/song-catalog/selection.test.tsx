import { act, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SongCatalogPage from './components/SongCatalogPage';
import SongSelectionView from './components/SongSelectionView';
import SongCover from './components/SongCover';
import useRandomSheetHistory from './hooks/useRandomSheetHistory';
import games from './config/games';
import { normalizeSongData } from './utils/normalizeSongData';
import { expandFilteredSongsToSheets } from './utils/filterSheets';
import { buildHistoryEntry } from './utils/randomSheet';
import { getSheetKey } from './utils/sheetIdentity';

vi.mock('../../components/ResponsiveLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
const testState = vi.hoisted(() => ({ reducedMotion: false, navigate: vi.fn() }));
vi.mock('../../hooks/useReducedMotion', () => ({ default: () => testState.reducedMotion }));
vi.mock('react-router-dom', () => ({ useNavigate: () => testState.navigate }));

const raw = (count = 120, title = 'Song') => ({ songs: Array.from({ length: count }, (_, i) => ({
  songId: `song-${i}`, title: `${title} ${i}`, artist: `Artist ${i}`, version: 'v1', type: 'DX', bpm: 180,
  imageName: `song-${i}.png`, sheets: [
    { id: 'basic', difficulty: 'BASIC', type: 'DX', level: '4', levelValue: 4 },
    { id: 'master', difficulty: 'MASTER', type: 'DX', level: '14', levelValue: 14, noteDesigner: 'Charter' },
  ],
})) });
const sheets = expandFilteredSongsToSheets(normalizeSongData(raw(1000), games[0].dataSource).songs);
const response = (data: unknown) => ({ ok: true, json: async () => data }) as Response;
beforeEach(() => {
  testState.reducedMotion = false;
  testState.navigate.mockClear();
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => response(raw())));
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function Selection({ items = sheets }: { items?: typeof sheets }) {
  const [selected, setSelected] = useState(getSheetKey(items[0], 'maimai'));
  return <SongSelectionView sheets={items} gameId="maimai" selectedKey={selected} onSelect={setSelected} onOpen={vi.fn()} />;
}

test('source sheet IDs remain intact while UI identity distinguishes songs and games', () => {
  expect(sheets[0].id).toBe(sheets[2].id);
  expect(getSheetKey(sheets[0], 'maimai')).not.toBe(getSheetKey(sheets[2], 'maimai'));
  expect(getSheetKey(sheets[0], 'maimai')).not.toBe(getSheetKey(sheets[0], 'sdvx'));
});

test('mixed chart types are distinguished only when the song has multiple types', () => {
  const mixedRaw = raw(1);
  mixedRaw.songs[0].sheets[1].type = 'STD';
  const mixedSheets = expandFilteredSongsToSheets(normalizeSongData(mixedRaw, games[0].dataSource).songs);
  render(<Selection items={mixedSheets} />);
  const group = screen.getByRole('group', { name: '歌曲谱面' });
  expect(within(group).getByRole('button', { name: 'DX BASIC 4' })).toBeInTheDocument();
  expect(within(group).getByRole('button', { name: 'STD MASTER 14' })).toBeInTheDocument();
  fireEvent.click(within(group).getByRole('button', { name: 'STD MASTER 14' }));
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveTextContent('STD MASTER');
});

test('a large catalog has a bounded window and keeps the active option mounted through keyboard jumps', () => {
  render(<Selection />);
  const list = screen.getByRole('listbox');
  expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(19);
  list.focus();
  fireEvent.keyDown(list, { key: 'End' });
  expect(document.getElementById(list.getAttribute('aria-activedescendant')!)).toHaveAttribute('aria-posinset', String(sheets.length));
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  expect(document.getElementById(list.getAttribute('aria-activedescendant')!)).toHaveAttribute('aria-posinset', '1');
  fireEvent.keyDown(list, { key: 'ArrowUp' });
  expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(19);
  expect(list).toHaveFocus();
});

test('native scrolling updates preview and active option without rendering the full pool', () => {
  render(<Selection />);
  const list = screen.getByRole('listbox');
  fireEvent.scroll(list, { target: { scrollTop: 48000 } });
  expect(document.getElementById(list.getAttribute('aria-activedescendant')!)).toHaveAttribute('aria-posinset', '1001');
  expect(within(screen.getByRole('article', { name: '当前谱面' })).getByRole('heading')).toHaveTextContent('Song 500');
  expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(19);
});

test.each([true, false])('scrollbar jumps render the viewport even while controlled selection lags (from bottom: %s)', (fromBottom) => {
  const first = getSheetKey(sheets[0], 'maimai');
  const last = getSheetKey(sheets.at(-1)!, 'maimai');
  const onSelect = vi.fn();
  const { rerender } = render(<SongSelectionView sheets={sheets} gameId="maimai"
    selectedKey={fromBottom ? last : first} onSelect={onSelect} onOpen={vi.fn()} />);
  const list = screen.getByRole('listbox');
  const index = fromBottom ? 0 : sheets.length - 1;
  const top = index * 48;
  fireEvent.scroll(list, { target: { scrollTop: top } });
  expect(list.querySelector(`[aria-posinset="${index + 1}"]`)).toBeInTheDocument();
  expect(document.getElementById(list.getAttribute('aria-activedescendant')!)).toBeInTheDocument();
  expect(list.querySelectorAll('[role="option"]').length).toBeLessThanOrEqual(20);
  expect(onSelect).toHaveBeenLastCalledWith(fromBottom ? first : last);
  rerender(<SongSelectionView sheets={sheets} gameId="maimai" selectedKey={fromBottom ? first : last}
    onSelect={onSelect} onOpen={vi.fn()} />);
  expect(list.scrollTop).toBe(top);
  expect(within(list).getByRole('option', { selected: true })).toHaveAttribute('aria-posinset', String(index + 1));
});

test('repeated scrollbar jumps between both ends keep selection, preview and visible rows synchronized', () => {
  render(<Selection />);
  const list = screen.getByRole('listbox');
  for (const index of [sheets.length - 1, 0, sheets.length - 1, 0, 1, 0]) {
    fireEvent.scroll(list, { target: { scrollTop: index * 48 } });
    expect(within(list).getByRole('option', { selected: true })).toHaveAttribute('aria-posinset', String(index + 1));
    expect(within(screen.getByRole('article', { name: '当前谱面' })).getByRole('heading'))
      .toHaveTextContent(sheets[index].songTitle);
    expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(19);
  }
});

test('short wheel notches select one chart at a time, wrap and keep preview and virtual focus in sync', () => {
  render(<Selection />);
  const list = screen.getByRole('listbox');
  const active = () => document.getElementById(list.getAttribute('aria-activedescendant')!);
  expect(fireEvent.wheel(list, { deltaY: 60 })).toBe(false);
  expect(active()).toHaveAttribute('aria-posinset', '2');
  expect(within(screen.getByRole('article', { name: '当前谱面' })).getByRole('heading')).toHaveTextContent('Song 0');
  fireEvent.wheel(list, { deltaY: 120 });
  expect(active()).toHaveAttribute('aria-posinset', '3');
  expect(list.scrollTop).toBe(96);
  expect(within(screen.getByRole('article', { name: '当前谱面' })).getByRole('heading')).toHaveTextContent('Song 1');
  fireEvent.wheel(list, { deltaY: -120 });
  fireEvent.wheel(list, { deltaY: -120 });
  fireEvent.wheel(list, { deltaY: -120 });
  expect(active()).toHaveAttribute('aria-posinset', String(sheets.length));
  expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(19);
});

test('selection identity survives sorting and Tab leaves the list', () => {
  const { rerender } = render(<><Selection /><button>After</button></>);
  const list = screen.getByRole('listbox');
  list.focus();
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  rerender(<><Selection items={[...sheets].reverse()} /><button>After</button></>);
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveTextContent('MASTER');
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveAttribute('aria-posinset', String(sheets.length - 1));
  userEvent.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
});

test('broken covers show a fallback and recover when the selected image changes', () => {
  const { rerender } = render(<SongCover src="one.png" />);
  fireEvent.error(document.querySelector('img')!);
  expect(screen.getByText('无封面')).toBeInTheDocument();
  rerender(<SongCover src="two.png" />);
  expect(screen.queryByText('无封面')).not.toBeInTheDocument();
  expect(document.querySelector('img')).toHaveAttribute('src', 'two.png');
});

test.each(games)('$id defaults to selection and opens matching detail, restoring focus on close', async (game) => {
  render(<SongCatalogPage game={game} />);
  const list = await screen.findByRole('listbox');
  expect(screen.getByRole('button', { name: '选曲' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('navigation', { name: '结果分页' })).not.toBeInTheDocument();
  list.focus();
  fireEvent.keyDown(list, { key: 'End' });
  fireEvent.keyDown(list, { key: 'Enter' });
  const dialog = screen.getByRole('dialog', { name: '谱面详情' });
  expect(within(dialog).getByRole('heading')).toHaveTextContent('Song 0');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(list).toHaveFocus();
});

test('filter drafts cancel, apply and clear correctly; invalid selection and empty preview are removed', async () => {
  render(<SongCatalogPage game={games[0]} />);
  const list = await screen.findByRole('listbox');
  fireEvent.keyDown(list, { key: 'End' });
  const open = screen.getByRole('button', { name: '筛选' });
  open.focus(); fireEvent.click(open);
  let dialog = screen.getByRole('dialog', { name: '筛选条件' });
  fireEvent.change(within(dialog).getByLabelText('曲名'), { target: { value: 'Song 11' } });
  fireEvent.keyDown(within(dialog).getByLabelText('曲名'), { key: 'ArrowDown' });
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveTextContent('Song 0');
  fireEvent.click(within(dialog).getByRole('button', { name: '取消' }));
  expect(open).toHaveFocus();
  fireEvent.click(open);
  dialog = screen.getByRole('dialog', { name: '筛选条件' });
  expect(within(dialog).getByLabelText('曲名')).toHaveValue('');
  fireEvent.change(within(dialog).getByLabelText('曲名'), { target: { value: 'Song 11' } });
  fireEvent.click(within(dialog).getByRole('button', { name: '应用筛选' }));
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveTextContent('Song 119');
  fireEvent.click(screen.getByRole('button', { name: /^筛选/ }));
  dialog = screen.getByRole('dialog', { name: '筛选条件' });
  fireEvent.change(within(dialog).getByLabelText('曲名'), { target: { value: 'no matching song' } });
  fireEvent.click(within(dialog).getByRole('button', { name: '应用筛选' }));
  expect(screen.getByRole('status')).toHaveTextContent('无结果');
  expect(screen.queryByRole('article', { name: '当前谱面' })).not.toBeInTheDocument();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '随机抽谱面' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '清空' }));
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('compatibility pagination uses 48, 96 and 144 and summary keeps the full pool', async () => {
  render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  fireEvent.click(screen.getByRole('button', { name: '网格' }));
  const grid = screen.getByRole('list', { name: '谱面网格' });
  expect(grid.children).toHaveLength(48);
  fireEvent.change(screen.getAllByLabelText('每页')[0], { target: { value: '96' } });
  expect(grid.children).toHaveLength(96);
  fireEvent.change(screen.getAllByLabelText('每页')[0], { target: { value: '144' } });
  expect(grid.children).toHaveLength(144);
  fireEvent.click(screen.getAllByRole('button', { name: '下一页' })[0]);
  expect(grid.children).toHaveLength(96);
  fireEvent.click(screen.getByRole('button', { name: '摘要' }));
  expect(screen.getByText('谱面').nextElementSibling).toHaveTextContent('240');
  expect(screen.getByText('歌曲').nextElementSibling).toHaveTextContent('120');
  expect(screen.queryByRole('navigation', { name: '结果分页' })).not.toBeInTheDocument();
});

test('random draw uses the entire pool including offscreen entries', async () => {
  render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  vi.spyOn(Math, 'random').mockReturnValue(.999999);
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: '随机抽谱面' }));
  expect(screen.getByRole('button', { name: '抽取中…' })).toBeDisabled();
  act(() => vi.advanceTimersByTime(300));
  const stored = JSON.parse(localStorage.getItem('creatl.songCatalog.randomHistory.maimai')!);
  expect(stored.__v).toBe(1);
  expect(stored.items[0].songId).toBe('song-0');
  expect(within(screen.getByRole('listbox')).getByRole('option', { selected: true })).toHaveTextContent('Song 0');
});

test('reduced motion removes the random drawing delay', async () => {
  testState.reducedMotion = true;
  render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: '随机抽谱面' }));
  act(() => vi.advanceTimersByTime(0));
  expect(JSON.parse(localStorage.getItem('creatl.songCatalog.randomHistory.maimai')!).items).toHaveLength(1);
});

test('applying a different candidate pool cancels a pending random draw', async () => {
  render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: '随机抽谱面' }));
  fireEvent.click(screen.getByRole('button', { name: '筛选' }));
  const dialog = screen.getByRole('dialog', { name: '筛选条件' });
  fireEvent.change(within(dialog).getByLabelText('曲名'), { target: { value: 'no result' } });
  fireEvent.click(within(dialog).getByRole('button', { name: '应用筛选' }));
  act(() => vi.advanceTimersByTime(300));
  expect(localStorage.getItem('creatl.songCatalog.randomHistory.maimai')).toBeNull();
});

test('stored history outside the current filter still opens matching live chart metadata', async () => {
  localStorage.setItem('creatl.songCatalog.randomHistory.maimai', JSON.stringify({ __v: 1, items: [buildHistoryEntry(sheets[0])] }));
  render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  fireEvent.click(screen.getByRole('button', { name: '筛选' }));
  const dialog = screen.getByRole('dialog', { name: '筛选条件' });
  fireEvent.change(within(dialog).getByLabelText('曲名'), { target: { value: 'Song 119' } });
  fireEvent.click(within(dialog).getByRole('button', { name: '应用筛选' }));
  fireEvent.click(within(screen.getByRole('complementary', { name: '随机谱面历史' })).getByRole('button', { name: /Song 0/ }));
  const detail = screen.getByRole('dialog', { name: '谱面详情' });
  expect(within(detail).getByRole('heading')).toHaveTextContent('Song 0');
  expect(within(detail).getByText('类型').nextElementSibling).toHaveTextContent('DX');
});

test('returning to the game directory carries the game to restore focus', async () => {
  render(<SongCatalogPage game={games[2]} />);
  await screen.findByRole('listbox');
  fireEvent.click(screen.getByRole('button', { name: '返回曲库' }));
  expect(testState.navigate).toHaveBeenCalledWith('/songs', { state: { catalogGameId: 'sdvx' } });
});

test('changing game or unmounting cancels a pending random draw', async () => {
  const { rerender, unmount } = render(<SongCatalogPage game={games[0]} />);
  await screen.findByRole('listbox');
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: '随机抽谱面' }));
  rerender(<SongCatalogPage game={games[1]} />);
  act(() => vi.advanceTimersByTime(300));
  expect(localStorage.getItem('creatl.songCatalog.randomHistory.maimai')).toBeNull();
  vi.useRealTimers();
  await screen.findByRole('listbox');
  vi.useFakeTimers();
  fireEvent.click(screen.getByRole('button', { name: '随机抽谱面' }));
  unmount();
  act(() => vi.advanceTimersByTime(300));
  expect(localStorage.getItem('creatl.songCatalog.randomHistory.chunithm')).toBeNull();
});

test('a late response from a previous game cannot overwrite the current game', async () => {
  let resolveOld: (value: Response) => void = () => {};
  vi.stubGlobal('fetch', vi.fn().mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }))
    .mockResolvedValue(response(raw(1, 'Current'))));
  const { rerender } = render(<SongCatalogPage game={games[0]} />);
  rerender(<SongCatalogPage game={games[1]} />);
  await screen.findByRole('listbox');
  await act(async () => { resolveOld(response(raw(1, 'Old'))); });
  expect(screen.getByRole('article', { name: '当前谱面' })).toHaveTextContent('Current 0');
  expect(screen.queryByText('Old 0')).not.toBeInTheDocument();
});

test('version 1 history restores, caps at 50, survives refresh and stays isolated per game', () => {
  const entry = buildHistoryEntry(sheets[0])!;
  localStorage.setItem('creatl.songCatalog.randomHistory.maimai', JSON.stringify({ __v: 1, items: Array(55).fill(entry) }));
  const { result, rerender, unmount } = renderHook(({ game }) => useRandomSheetHistory(game), { initialProps: { game: 'maimai' } });
  expect(result.current.history).toHaveLength(50);
  rerender({ game: 'sdvx' });
  expect(result.current.history).toHaveLength(0);
  act(() => result.current.addEntry({ ...entry, title: 'SDVX entry' }));
  expect(JSON.parse(localStorage.getItem('creatl.songCatalog.randomHistory.sdvx')!).items[0].title).toBe('SDVX entry');
  unmount();
  const restored = renderHook(() => useRandomSheetHistory('sdvx'));
  expect(restored.result.current.history[0].title).toBe('SDVX entry');
});

test('disabled or full storage does not break history in memory', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('disabled'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  const { result } = renderHook(() => useRandomSheetHistory('maimai'));
  expect(result.current.history).toEqual([]);
  act(() => result.current.addEntry(buildHistoryEntry(sheets[0])));
  expect(result.current.history).toHaveLength(1);
  act(() => result.current.clearAll());
  expect(result.current.history).toHaveLength(0);
});
