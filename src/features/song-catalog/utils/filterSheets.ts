import type { Song, Sheet, CatalogSheet, FilterConfig, SongFilters, LevelRange, ActiveFilterTag } from '../types';

// Filter helpers shared by the three catalog games.
// All functions take the generic game config so callers don't reach
// into song-specific shapes.

const getByPath = (item: unknown, path: string | ((item: unknown) => unknown) | undefined): unknown => {
  if (!path) return undefined;
  if (typeof path === 'function') return path(item);
  return path.split('.').reduce<unknown>((value, key) =>
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)[key] : undefined, item);
};

const songFields = (config: FilterConfig) => config?.fields?.song || {};
const sheetFields = (config: FilterConfig) => config?.fields?.sheet || {};

const uniq = <T,>(values: T[]) => [...new Set(values.filter(Boolean))];
const textOptions = (values: unknown[]): string[] => uniq(values.map(safeString));

const normalizeText = (value: unknown) => safeString(value).toLowerCase();

const safeString = (value: unknown) => (value === null || value === undefined ? '' : String(value));

const safeNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
};

const compareText = (a: unknown, b: unknown, dir: number) =>
  safeString(a).localeCompare(safeString(b)) * dir;

const compareNumber = (a: unknown, b: unknown, dir: number) => {
  const aNumber = safeNumber(a);
  const bNumber = safeNumber(b);
  const aMissing = aNumber === null;
  const bMissing = bNumber === null;
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return (aNumber - bNumber) * dir;
};

const isDefaultLevelRange = (range: LevelRange, config: FilterConfig) => {
  if (!config?.levelRange?.default) return false;
  const [min, max] = config.levelRange.default;
  return range[0] === min && range[1] === max;
};

const readSheetLevel = (sheet: Sheet, config: FilterConfig) => {
  const fields = sheetFields(config);
  const value =
    getByPath(sheet, fields.internalLevelValue) ??
    getByPath(sheet, fields.levelValue) ??
    getByPath(sheet, fields.level);
  return safeNumber(value);
};

export const createDefaultFilters = (config: FilterConfig): SongFilters => ({
  searchText: '',
  difficultyFilter: [],
  versionFilter: [],
  typeFilter: [],
  levelRange: [...(config?.levelRange?.default || [1, 20])],
  pendingFilter: [],
  artistFilter: '',
  noteDesignerFilter: [],
  regionFilter: [],
  bpmMin: null,
  bpmMax: null,
});

export const cloneFilters = (filters: SongFilters): SongFilters => ({
  ...filters,
  difficultyFilter: [...filters.difficultyFilter],
  versionFilter: [...filters.versionFilter],
  typeFilter: [...filters.typeFilter],
  levelRange: [...filters.levelRange],
  pendingFilter: [...filters.pendingFilter],
  noteDesignerFilter: [...filters.noteDesignerFilter],
  regionFilter: [...filters.regionFilter],
});

export const collectFilterOptions = (songs: Song[], config: FilterConfig) => {
  const sFields = songFields(config);
  const shFields = sheetFields(config);

  const difficulties = textOptions(
    songs.flatMap((song) =>
      (song.sheets || []).map((sheet) => getByPath(sheet, shFields.difficulty))
    )
  );
  const versions = textOptions(songs.map((song) => getByPath(song, sFields.version)));
  const types = textOptions(
    songs.map((song) =>
      getByPath(song, sFields.type) ?? getByPath(song, sFields.category)
    )
  );
  const artists = textOptions(songs.map((song) => getByPath(song, sFields.artist)));
  const noteDesigners = textOptions(
    songs.flatMap((song) =>
      (song.sheets || []).map((sheet) => getByPath(sheet, shFields.noteDesigner))
    )
  );
  const bpms = uniq(songs.map((song) => song.bpm));

  return {
    difficulties,
    versions,
    types,
    artists,
    noteDesigners,
    bpms,
  };
};

const songMatchesText = (song: Song, sFields: Record<string, string>, query: string) => {
  if (!query) return true;
  const title = normalizeText(getByPath(song, sFields.title));
  const artist = normalizeText(getByPath(song, sFields.artist));
  return title.includes(query) || artist.includes(query);
};

const songMatchesVersion = (song: Song, sFields: Record<string, string>, versionFilter: string[]) => {
  if (!versionFilter || versionFilter.length === 0) return true;
  return versionFilter.includes(safeString(getByPath(song, sFields.version)));
};

const songMatchesType = (song: Song, sFields: Record<string, string>, typeFilter: string[]) => {
  if (!typeFilter || typeFilter.length === 0) return true;
  const value =
    getByPath(song, sFields.type) ?? getByPath(song, sFields.category);
  return typeFilter.includes(safeString(value));
};

const songMatchesArtist = (song: Song, sFields: Record<string, string>, artistQuery: string) => {
  if (!artistQuery) return true;
  return normalizeText(getByPath(song, sFields.artist)).includes(
    normalizeText(artistQuery)
  );
};

const songMatchesBpm = (song: Song, bpmMin: number | null, bpmMax: number | null) => {
  const min = safeNumber(bpmMin);
  const max = safeNumber(bpmMax);
  if (min === null && max === null) return true;
  if (song.bpm === null || song.bpm === undefined) return false;
  const low = min !== null && max !== null ? Math.min(min, max) : min;
  const high = min !== null && max !== null ? Math.max(min, max) : max;
  if (low !== null && song.bpm < low) return false;
  if (high !== null && song.bpm > high) return false;
  return true;
};

const sheetMatchesNoteDesigner = (sheet: Sheet, shFields: Record<string, string>, filter: string[]) => {
  if (!filter || filter.length === 0) return true;
  return filter.includes(safeString(getByPath(sheet, shFields.noteDesigner)));
};

const sheetMatchesDifficulty = (sheet: Sheet, shFields: Record<string, string>, filter: string[]) => {
  if (!filter || filter.length === 0) return true;
  return filter.includes(safeString(getByPath(sheet, shFields.difficulty)));
};

const sheetMatchesLevel = (sheet: Sheet, config: FilterConfig, range: LevelRange) => {
  if (isDefaultLevelRange(range, config)) return true;
  const level = readSheetLevel(sheet, config);
  if (level === null) return false;
  return level >= range[0] && level <= range[1];
};

export const applySongFilters = (songs: Song[], filters: SongFilters, config: FilterConfig): Song[] => {
  if (!songs) return [];
  const sFields = songFields(config);
  const shFields = sheetFields(config);

  const hasSheetFilters =
    filters.difficultyFilter.length > 0 ||
    filters.noteDesignerFilter.length > 0 ||
    !isDefaultLevelRange(filters.levelRange, config);

  return songs
    .filter((song) => {
      if (!songMatchesText(song, sFields, filters.searchText)) return false;
      if (!songMatchesVersion(song, sFields, filters.versionFilter)) return false;
      if (!songMatchesType(song, sFields, filters.typeFilter)) return false;
      if (!songMatchesArtist(song, sFields, filters.artistFilter)) return false;
      if (!songMatchesBpm(song, filters.bpmMin, filters.bpmMax)) return false;
      return true;
    })
    .map((song) => {
      if (!hasSheetFilters) return song;
      const matched = (song.sheets || []).filter(
        (sheet) =>
          sheetMatchesDifficulty(sheet, shFields, filters.difficultyFilter) &&
          sheetMatchesLevel(sheet, config, filters.levelRange) &&
          sheetMatchesNoteDesigner(sheet, shFields, filters.noteDesignerFilter)
      );

      return matched.length > 0
        ? { ...song, allSheets: song.sheets || [], sheets: matched }
        : null;
    })
    .filter((item) => item !== null);
};

export const expandFilteredSongsToSheets = (filteredSongs: Song[]): CatalogSheet[] => {
  if (!filteredSongs) return [];
  const sheets: CatalogSheet[] = [];
  filteredSongs.forEach((song) => {
    const sourceSheets = song.allSheets || song.sheets || [];
    const songSheets = sourceSheets.map((sheet) => ({
      id: sheet.id,
      difficulty: sheet.difficulty,
      level: sheet.level,
      levelValue: sheet.levelValue,
      internalLevelValue: sheet.internalLevelValue,
      type: sheet.type,
      noteDesigner: sheet.noteDesigner,
      notes: sheet.notes,
      noteCounts: sheet.noteCounts,
      notePercents: sheet.notePercents,
    }));
    (song.sheets || []).forEach((sheet) => {
      sheets.push({
        ...sheet,
        songId: song.songId,
        songNo: song.songNo,
        songTitle: song.title,
        songArtist: song.artist,
        songVersion: song.version,
        songReleaseDate: song.releaseDate,
        songType: song.type,
        songImageUrl: song.imageUrl,
        songCategory: song.category,
        songBpm: song.bpm,
        songSheets,
      });
    });
  });
  return sheets;
};

export const sortSheets = (sheets: CatalogSheet[], sortBy: string, sortDir: string, config: FilterConfig) => {
  const dir = sortDir === 'ASC' ? 1 : -1;
  const shFields = sheetFields(config);
  const shLevel = (sheet: CatalogSheet) => {
    const value =
      getByPath(sheet, shFields.internalLevelValue) ??
      getByPath(sheet, shFields.levelValue) ??
      safeNumber(getByPath(sheet, shFields.level));
    return value;
  };
  const byStableSheet = (a: CatalogSheet, b: CatalogSheet) =>
    compareText(a.songTitle, b.songTitle, 1) ||
    compareText(a.difficulty, b.difficulty, 1) ||
    compareText(a.id, b.id, 1);
  type Comparator = (a: CatalogSheet, b: CatalogSheet) => number;
  const withFallback = (compare: Comparator): Comparator => (a, b) => compare(a, b) || byStableSheet(a, b);
  const compareVersion = (a: CatalogSheet, b: CatalogSheet) => {
    const order = config?.versionOrder || [];
    if (order.length > 0) {
      const aIndex = order.indexOf(a.songVersion);
      const bIndex = order.indexOf(b.songVersion);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        if (aIndex !== bIndex) return (aIndex - bIndex) * dir;
      }
    }
    return compareText(a.songVersion, b.songVersion, dir);
  };
  const compareOrdered = (path: string, order?: string[]) => withFallback((a, b) => {
    if (!order || order.length === 0) return compareText(getByPath(a, path), getByPath(b, path), dir);
    const aValue = getByPath(a, path);
    const bValue = getByPath(b, path);
    const aIndex = order.indexOf(safeString(aValue));
    const bIndex = order.indexOf(safeString(bValue));
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      if (aIndex !== bIndex) return (aIndex - bIndex) * dir;
    }
    return compareText(aValue, bValue, dir);
  });
  const comparePathNumber = (path: string) =>
    withFallback((a, b) => compareNumber(getByPath(a, path), getByPath(b, path), dir));

  const compareFns: Record<string, Comparator> = {
    songNo: withFallback((a, b) => compareNumber(a.songNo, b.songNo, dir)),
    level: withFallback((a, b) => compareNumber(shLevel(a), shLevel(b), dir)),
    levelValue: withFallback((a, b) => compareNumber(a.levelValue, b.levelValue, dir)),
    internalLevelValue: withFallback((a, b) => compareNumber(a.internalLevelValue, b.internalLevelValue, dir)),
    title: withFallback((a, b) => compareText(a.songTitle, b.songTitle, dir)),
    artist: withFallback((a, b) => compareText(a.songArtist, b.songArtist, dir)),
    bpm: withFallback((a, b) => compareNumber(a.songBpm, b.songBpm, dir)),
    version: withFallback(compareVersion),
    releaseDate: withFallback((a, b) => compareText(a.songReleaseDate, b.songReleaseDate, dir)),
    category: compareOrdered('songCategory', config?.categoryOrder),
    type: compareOrdered('type', config?.typeOrder),
    difficulty: compareOrdered('difficulty', config?.difficultyOrder),
    noteTap: comparePathNumber('noteCounts.tap'),
    noteTapPercent: comparePathNumber('notePercents.tap'),
    noteHold: comparePathNumber('noteCounts.hold'),
    noteHoldPercent: comparePathNumber('notePercents.hold'),
    noteSlide: comparePathNumber('noteCounts.slide'),
    noteSlidePercent: comparePathNumber('notePercents.slide'),
    noteTouch: comparePathNumber('noteCounts.touch'),
    noteTouchPercent: comparePathNumber('notePercents.touch'),
    noteBreak: comparePathNumber('noteCounts.break'),
    noteBreakPercent: comparePathNumber('notePercents.break'),
    noteAir: comparePathNumber('noteCounts.air'),
    noteAirPercent: comparePathNumber('notePercents.air'),
    noteFlick: comparePathNumber('noteCounts.flick'),
    noteFlickPercent: comparePathNumber('notePercents.flick'),
    noteTotal: comparePathNumber('noteCounts.total'),
  };

  const compare = compareFns[sortBy] || compareFns.level;
  return [...sheets].sort(compare);
};

export const buildActiveFilterTags = (filters: SongFilters, config: FilterConfig) => {
  const tags: ActiveFilterTag[] = [];

  if (filters.searchText) {
    tags.push({
      key: 'searchText',
      label: '搜索',
      value: filters.searchText,
    });
  }
  if (filters.difficultyFilter.length > 0) {
    tags.push({
      key: 'difficultyFilter',
      label: '难度',
      value: filters.difficultyFilter.join(', '),
    });
  }
  if (filters.versionFilter.length > 0) {
    tags.push({
      key: 'versionFilter',
      label: '版本',
      value: filters.versionFilter.join(', '),
    });
  }
  if (filters.typeFilter.length > 0) {
    tags.push({
      key: 'typeFilter',
      label: '类型',
      value: filters.typeFilter.join(', '),
    });
  }
  if (filters.noteDesignerFilter.length > 0) {
    tags.push({
      key: 'noteDesignerFilter',
      label: '谱面设计',
      value: filters.noteDesignerFilter.join(', '),
    });
  }
  if (filters.artistFilter) {
    tags.push({
      key: 'artistFilter',
      label: '艺术家',
      value: filters.artistFilter,
    });
  }
  if (filters.bpmMin !== null || filters.bpmMax !== null) {
    tags.push({
      key: 'bpmRange',
      label: 'BPM',
      value: `${filters.bpmMin ?? '-'} ~ ${filters.bpmMax ?? '-'}`,
    });
  }
  if (!isDefaultLevelRange(filters.levelRange, config)) {
    tags.push({
      key: 'levelRange',
      label: '等级',
      value: `${filters.levelRange[0]} - ${filters.levelRange[1]}`,
    });
  }

  return tags;
};

export const clearFilter = (key: keyof SongFilters | "bpmRange", config: FilterConfig) => {
  if (key === 'searchText') return '';
  if (key === 'artistFilter') return '';
  if (key === 'levelRange') return [...(config.levelRange.default || [1, 20])];
  if (key === 'bpmRange') return { bpmMin: null, bpmMax: null };
  return [];
};
