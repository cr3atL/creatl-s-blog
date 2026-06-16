import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import SongCatalogHome from './components/SongCatalogHome';
import SongCatalogPage from './components/SongCatalogPage';
import SongResultSummary from './components/SongResultSummary';
import games, { getGameById } from './config/games';
import {
  applySongFilters,
  buildActiveFilterTags,
  createDefaultFilters,
  cloneFilters,
  collectFilterOptions,
  expandFilteredSongsToSheets,
  sortSheets,
} from './utils/filterSheets';
import {
  buildHistoryEntry,
  drawRandomSheet,
  trimHistory,
} from './utils/randomSheet';
import { normalizeSongData } from './utils/normalizeSongData';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/songs/maimai' }),
}), { virtual: true });

jest.mock('../../components/ResponsiveLayout', () => ({ children }) => <>{children}</>);

jest.mock('../../utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('@ant-design/icons', () => ({
  MenuOutlined: () => <span />,
}));

jest.mock('antd', () => {
  const Button = ({ children, onClick, ...props }) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  );
  const Layout = ({ children, ...props }) => <div {...props}>{children}</div>;
  Layout.Content = ({ children, ...props }) => <main {...props}>{children}</main>;
  Layout.Footer = ({ children, ...props }) => <footer {...props}>{children}</footer>;
  return { Layout, Button };
});

const SAMPLE_RAW = {
  songs: [
    {
      songId: 'song-001',
      title: 'PANDEMONIUM',
      artist: 'Camellia',
      version: 'UNLIMITED',
      category: 'ORIGINAL',
      bpm: 200,
      imageName: '001',
      sheets: [
        { difficulty: 'BASIC', level: '6', levelValue: 6.0, internalLevelValue: 6.5 },
        { difficulty: 'EXPERT', level: '10', levelValue: 10.0, internalLevelValue: 10.4 },
        { difficulty: 'MASTER', level: '13', levelValue: 13.0, internalLevelValue: 13.7, noteDesigner: 'Nitro Fun' },
      ],
    },
    {
      songId: 'song-002',
      title: 'Aleph-0',
      artist: '翡乃イスカ',
      version: 'UNLIMITED',
      category: 'VARIETY',
      bpm: 222,
      imageName: '002',
      sheets: [
        { difficulty: 'MASTER', level: '14', levelValue: 14.0, internalLevelValue: 14.6, noteDesigner: 'Jack' },
        { difficulty: 'RE:MASTER', level: '15', levelValue: 15.0, internalLevelValue: 15.4, noteDesigner: 'Jack' },
      ],
    },
  ],
};

describe('song-catalog config & utils', () => {
  test('exposes the three configured games', () => {
    expect(games).toHaveLength(3);
    expect(getGameById('maimai').label).toBe('MAIMAI DX');
    expect(getGameById('chunithm').label).toBe('CHUNITHM');
    expect(getGameById('sdvx').label).toBe('SOUND VOLTEX EG');
  });

  test('resolve game by path', () => {
    expect(games.find((g) => g.path === '/songs/maimai').id).toBe('maimai');
    expect(games.find((g) => g.path === '/songs/chunithm').id).toBe('chunithm');
    expect(games.find((g) => g.path === '/songs/sdvx').id).toBe('sdvx');
  });

  test('normalizeSongData produces a stable shape', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    expect(data.songs).toHaveLength(2);
    expect(data.songs[0].title).toBe('PANDEMONIUM');
    expect(data.songs[0].sheets).toHaveLength(3);
    expect(data.songs[0].imageUrl).toBe('https://example.test/maimai/img/cover/001');
  });

  test('createDefaultFilters and cloneFilters preserve arrays', () => {
    const cfg = games[0].filterConfig;
    const defaults = createDefaultFilters(cfg);
    const cloned = cloneFilters(defaults);
    expect(cloned).toEqual(defaults);
    cloned.difficultyFilter.push('MASTER');
    expect(defaults.difficultyFilter).toHaveLength(0);
  });

  test('collectFilterOptions reads from songs + sheets', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const options = collectFilterOptions(data.songs, games[0].filterConfig);
    expect(options.difficulties).toEqual(
      expect.arrayContaining(['BASIC', 'EXPERT', 'MASTER', 'RE:MASTER'])
    );
    expect(options.versions).toContain('UNLIMITED');
    expect(options.types).toEqual(expect.arrayContaining(['ORIGINAL', 'VARIETY']));
    expect(options.noteDesigners).toEqual(expect.arrayContaining(['Nitro Fun', 'Jack']));
  });

  test('applySongFilters prunes sheets when sheetMatchBehavior is prune', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const cfg = { ...games[1].filterConfig, sheetMatchBehavior: 'prune' };
    const filters = { ...createDefaultFilters(cfg), difficultyFilter: ['MASTER'] };
    const filtered = applySongFilters(data.songs, filters, cfg);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].sheets).toHaveLength(1);
    expect(filtered[0].sheets[0].difficulty).toBe('MASTER');
  });

  test('applySongFilters prunes sheet-level filters for every game', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const filters = { ...createDefaultFilters(games[0].filterConfig), difficultyFilter: ['MASTER'] };
    const filtered = applySongFilters(data.songs, filters, games[0].filterConfig);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].sheets).toHaveLength(1);
    expect(filtered.flatMap((song) => song.sheets).every((sheet) => sheet.difficulty === 'MASTER')).toBe(true);
  });

  test('applySongFilters treats different fields as AND and same field as OR', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const filters = {
      ...createDefaultFilters(games[0].filterConfig),
      difficultyFilter: ['MASTER', 'RE:MASTER'],
      levelRange: [14, 16],
    };
    const filtered = applySongFilters(data.songs, filters, games[0].filterConfig);
    const sheets = expandFilteredSongsToSheets(filtered);
    expect(sheets.map((sheet) => sheet.difficulty)).toEqual(['MASTER', 'RE:MASTER']);
    expect(sheets.every((sheet) => sheet.internalLevelValue >= 14)).toBe(true);
  });

  test('applySongFilters prunes note designer matches to matching sheets', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const filters = {
      ...createDefaultFilters(games[0].filterConfig),
      noteDesignerFilter: ['Nitro Fun'],
    };
    const filtered = applySongFilters(data.songs, filters, games[0].filterConfig);
    const sheets = expandFilteredSongsToSheets(filtered);
    expect(sheets).toHaveLength(1);
    expect(sheets[0].noteDesigner).toBe('Nitro Fun');
  });

  test('applySongFilters normalizes BPM bounds', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const filters = {
      ...createDefaultFilters(games[0].filterConfig),
      bpmMin: 230,
      bpmMax: 210,
    };
    const filtered = applySongFilters(data.songs, filters, games[0].filterConfig);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Aleph-0');
  });

  test('expandFilteredSongsToSheets copies song-level fields to each sheet', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const expanded = expandFilteredSongsToSheets(data.songs);
    expect(expanded).toHaveLength(5);
    expanded.forEach((sheet) => {
      expect(sheet.songTitle).toBeDefined();
      expect(sheet.songId).toBeDefined();
      expect(sheet.songSheets.length).toBeGreaterThan(0);
    });
  });

  test('sortSheets supports level/title/artist/bpm/version/difficulty', () => {
    const data = normalizeSongData(SAMPLE_RAW, 'https://example.test/maimai');
    const expanded = expandFilteredSongsToSheets(data.songs);
    const byLevel = sortSheets(expanded, 'level', 'ASC', games[0].filterConfig);
    const levels = byLevel.map((s) => s.internalLevelValue);
    const sortedLevels = [...levels].sort((a, b) => a - b);
    expect(levels).toEqual(sortedLevels);

    const byTitle = sortSheets(expanded, 'title', 'ASC', games[0].filterConfig);
    const titles = byTitle.map((s) => s.songTitle);
    expect(titles).toEqual([...titles].sort());

    const byArtist = sortSheets(expanded, 'artist', 'ASC', games[0].filterConfig);
    const artists = byArtist.map((s) => s.songArtist);
    expect(artists).toEqual([...artists].sort((a, b) => a.localeCompare(b)));
  });

  test('sortSheets follows game metadata order and note count fields', () => {
    const sheets = [
      {
        id: 'master',
        songTitle: 'B',
        difficulty: 'master',
        songVersion: 'v2',
        type: 'dx',
        noteCounts: { tap: 100, total: 300 },
        notePercents: { tap: 1 / 3 },
      },
      {
        id: 'basic',
        songTitle: 'A',
        difficulty: 'basic',
        songVersion: 'v1',
        type: 'std',
        noteCounts: { tap: 200, total: 400 },
        notePercents: { tap: 0.5 },
      },
    ];
    const cfg = {
      ...games[0].filterConfig,
      versionOrder: ['v1', 'v2'],
      typeOrder: ['std', 'dx'],
      difficultyOrder: ['basic', 'master'],
    };

    expect(sortSheets(sheets, 'difficulty', 'ASC', cfg).map((s) => s.id)).toEqual([
      'basic',
      'master',
    ]);
    expect(sortSheets(sheets, 'version', 'DESC', cfg).map((s) => s.id)).toEqual([
      'master',
      'basic',
    ]);
    expect(sortSheets(sheets, 'noteTapPercent', 'ASC', cfg).map((s) => s.id)).toEqual([
      'master',
      'basic',
    ]);
  });

  test('sortSheets keeps missing numeric values last', () => {
    const sheets = [
      { id: 'missing', songTitle: 'B', internalLevelValue: null, songBpm: null },
      { id: 'low', songTitle: 'A', internalLevelValue: 8, songBpm: 120 },
      { id: 'high', songTitle: 'C', internalLevelValue: 14.9, songBpm: 200 },
    ];
    expect(sortSheets(sheets, 'level', 'ASC', games[0].filterConfig).map((s) => s.id)).toEqual([
      'low',
      'high',
      'missing',
    ]);
    expect(sortSheets(sheets, 'bpm', 'DESC', games[0].filterConfig).map((s) => s.id)).toEqual([
      'high',
      'low',
      'missing',
    ]);
  });

  test('buildActiveFilterTags reflects active filters', () => {
    const cfg = games[0].filterConfig;
    const filters = {
      ...createDefaultFilters(cfg),
      searchText: 'pand',
      difficultyFilter: ['MASTER'],
      levelRange: [13, 14],
    };
    const tags = buildActiveFilterTags(filters, cfg);
    expect(tags.map((t) => t.key)).toEqual(
      expect.arrayContaining(['searchText', 'difficultyFilter', 'levelRange'])
    );
  });
});

describe('random sheet picking', () => {
  test('drawRandomSheet returns one of the inputs', () => {
    const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const picked = drawRandomSheet(pool);
    expect(pool).toContainEqual(picked);
  });

  test('drawRandomSheet returns null for empty pool', () => {
    expect(drawRandomSheet([])).toBeNull();
    expect(drawRandomSheet(null)).toBeNull();
  });

  test('trimHistory caps entries', () => {
    const items = Array.from({ length: 60 }, (_, i) => ({ id: i }));
    expect(trimHistory(items, 50)).toHaveLength(50);
  });

  test('buildHistoryEntry composes a record', () => {
    const sheet = {
      id: 's1',
      songId: 'song-1',
      songTitle: 'PANDEMONIUM',
      songArtist: 'Camellia',
      songBpm: 200,
      songSheets: [
        { id: 'b1', difficulty: 'BASIC', level: '6', internalLevelValue: 6.5 },
        { id: 's1', difficulty: 'MASTER', level: '13', internalLevelValue: 13.7 },
      ],
      difficulty: 'MASTER',
      internalLevelValue: 13.7,
      level: '13',
    };
    const entry = buildHistoryEntry(sheet);
    expect(entry.title).toBe('PANDEMONIUM');
    expect(entry.difficulty).toBe('MASTER');
    expect(entry.level).toBe(13.7);
    expect(entry.songSheets).toHaveLength(2);
    expect(entry.drawnAt).toBeDefined();
  });
});

describe('SongCatalogHome', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders one card per configured game and navigates on click', () => {
    render(<SongCatalogHome />);

    expect(screen.getByText('MAIMAI DX')).toBeInTheDocument();
    expect(screen.getByText('CHUNITHM')).toBeInTheDocument();
    expect(screen.getByText('SOUND VOLTEX EG')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/打开 MAIMAI DX 曲库/i));
    expect(mockNavigate).toHaveBeenCalledWith('/songs/maimai');
  });

  test('displays the data source footer', () => {
    render(<SongCatalogHome />);
    expect(
      screen.getByText(/cloudfront CDN \(arcade-songs mirror\)/)
    ).toBeInTheDocument();
  });
});

describe('SongCatalogPage', () => {
  const game = getGameById('maimai');

  let originalFetch;

  beforeEach(() => {
    mockNavigate.mockClear();
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(SAMPLE_RAW),
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('renders loading state then result table', async () => {
    render(<SongCatalogPage game={game} />);

    expect(screen.getByText(/正在加载 MAIMAI DX/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('PANDEMONIUM').length).toBeGreaterThan(0);
    });
  });

  test('opens filter modal and toggles a chip', async () => {
    render(<SongCatalogPage game={game} />);

    await waitFor(() => {
      expect(screen.getAllByText('PANDEMONIUM').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /^筛选/ }));
    expect(screen.getByText('筛选模式')).toBeInTheDocument();

    // The difficulty section is open by default; toggle the MASTER chip.
    const masterChip = await screen.findByRole('button', { name: /\[ \] MASTER/ });
    fireEvent.click(masterChip);
    expect(
      await screen.findByRole('button', { name: /\[x\] MASTER/ })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /应用筛选/ }));

    await waitFor(() => {
      expect(
        screen.getAllByText('难度').length
      ).toBeGreaterThan(0);
    });
  });

  test('draws a random sheet and writes history', async () => {
    render(<SongCatalogPage game={game} />);

    await waitFor(() => {
      expect(screen.getAllByText('PANDEMONIUM').length).toBeGreaterThan(0);
    });

    const drawButtons = screen.getAllByRole('button', { name: /随机抽谱面|再抽一次/ });
    fireEvent.click(drawButtons[0]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 320));
    });

    const history = JSON.parse(window.localStorage.getItem('creatl.songCatalog.randomHistory.maimai'));
    expect(history).toBeTruthy();
    expect(history.items.length).toBe(1);
    expect(history.items[0].title).toMatch(/PANDEMONIUM|Aleph-0/);
    expect(history.items[0].songSheets.length).toBeGreaterThan(0);
  });

  test('renders error state with retry button when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('boom')));

    render(<SongCatalogPage game={game} />);

    await waitFor(() => {
      expect(screen.getByText(/! 错误/)).toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: /重试/ })
    ).toBeInTheDocument();
  });

  test('switches view modes and sorts', async () => {
    render(<SongCatalogPage game={game} />);

    await waitFor(() => {
      expect(screen.getAllByText('PANDEMONIUM').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: '详情' }));
    expect(screen.getByRole('table')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '摘要' }));
    expect(screen.getByText('谱面')).toBeInTheDocument();
    expect(screen.getByText('难度分布')).toBeInTheDocument();
  });

  test('filter modal closes on Escape', async () => {
    render(<SongCatalogPage game={game} />);

    await waitFor(() => {
      expect(screen.getAllByText('PANDEMONIUM').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /^筛选/ }));
    expect(screen.getByText('筛选模式')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByText('筛选模式')).not.toBeInTheDocument();
    });
  });
});

describe('SongResultSummary', () => {
  test('shows versions before difficulties and orders difficulty buckets', () => {
    const sheets = [
      { songId: '1', songVersion: 'v1', difficulty: 'BASIC', internalLevelValue: 3 },
      { songId: '2', songVersion: 'v2', difficulty: 'MASTER', internalLevelValue: 13 },
      { songId: '3', songVersion: 'v2', difficulty: 'ADVANCED', internalLevelValue: 7 },
      { songId: '4', songVersion: 'v3', difficulty: 'RE:MASTER', internalLevelValue: 14 },
      { songId: '5', songVersion: 'v3', difficulty: 'EXPERT', internalLevelValue: 10 },
    ];

    render(<SongResultSummary sheets={sheets} />);

    expect(screen.getByText('版本分布')).toBeInTheDocument();
    expect(screen.getByText('难度分布')).toBeInTheDocument();
    expect(
      screen.getByText('版本分布').compareDocumentPosition(screen.getByText('难度分布')) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    const labels = screen
      .getByText('难度分布')
      .closest('section')
      .querySelectorAll('.song-catalog-summary__row-label');
    expect([...labels].map((label) => label.textContent)).toEqual([
      'RE:MASTER',
      'MASTER',
      'EXPERT',
      'ADVANCED',
      'BASIC',
    ]);
  });

  test('orders maimai versions from newest to oldest when provided', () => {
    const sheets = [
      { songId: '1', songVersion: 'BUDDiES', difficulty: 'MASTER', internalLevelValue: 13 },
      { songId: '2', songVersion: 'UNKNOWN TEST', difficulty: 'MASTER', internalLevelValue: 13 },
      { songId: '3', songVersion: 'CiRCLE PLUS', difficulty: 'MASTER', internalLevelValue: 13 },
      { songId: '4', songVersion: 'PRiSM PLUS', difficulty: 'MASTER', internalLevelValue: 13 },
    ];

    render(
      <SongResultSummary
        sheets={sheets}
        versionOrder={getGameById('maimai').summaryVersionOrder}
      />
    );

    const labels = screen
      .getByText('版本分布')
      .closest('section')
      .querySelectorAll('.song-catalog-summary__row-label');
    expect([...labels].map((label) => label.textContent)).toEqual([
      'CiRCLE PLUS',
      'PRiSM PLUS',
      'BUDDiES',
      'UNKNOWN TEST',
    ]);
  });
});
