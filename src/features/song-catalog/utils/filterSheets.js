// Filter helpers shared by the three catalog games.
// All functions take the generic game config so callers don't reach
// into song-specific shapes.

const getByPath = (item, path) => {
  if (!path) return undefined;
  if (typeof path === 'function') return path(item);
  return String(path)
    .split('.')
    .reduce((value, key) => (value === null || value === undefined ? value : value[key]), item);
};

const songFields = (config) => config?.fields?.song || {};
const sheetFields = (config) => config?.fields?.sheet || {};

const uniq = (values) => [...new Set(values.filter(Boolean))];

const normalizeText = (value) => safeString(value).toLowerCase();

const safeString = (value) => (value === null || value === undefined ? '' : String(value));

const safeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const compareText = (a, b, dir) =>
  safeString(a).localeCompare(safeString(b)) * dir;

const compareNumber = (a, b, dir) => {
  const aNumber = safeNumber(a);
  const bNumber = safeNumber(b);
  const aMissing = aNumber === null;
  const bMissing = bNumber === null;
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  return (aNumber - bNumber) * dir;
};

const isDefaultLevelRange = (range, config) => {
  if (!config?.levelRange?.default) return false;
  const [min, max] = config.levelRange.default;
  return range[0] === min && range[1] === max;
};

const readSheetLevel = (sheet, config) => {
  const fields = sheetFields(config);
  const value =
    getByPath(sheet, fields.internalLevelValue) ??
    getByPath(sheet, fields.levelValue) ??
    getByPath(sheet, fields.level);
  return safeNumber(value);
};

export const createDefaultFilters = (config) => ({
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

export const cloneFilters = (filters) => ({
  ...filters,
  difficultyFilter: [...filters.difficultyFilter],
  versionFilter: [...filters.versionFilter],
  typeFilter: [...filters.typeFilter],
  levelRange: [...filters.levelRange],
  pendingFilter: [...filters.pendingFilter],
  noteDesignerFilter: [...filters.noteDesignerFilter],
  regionFilter: [...filters.regionFilter],
});

export const collectFilterOptions = (songs, config) => {
  const sFields = songFields(config);
  const shFields = sheetFields(config);

  const difficulties = uniq(
    songs.flatMap((song) =>
      (song.sheets || []).map((sheet) => getByPath(sheet, shFields.difficulty))
    )
  );
  const versions = uniq(songs.map((song) => getByPath(song, sFields.version)));
  const types = uniq(
    songs.map((song) =>
      getByPath(song, sFields.type) ?? getByPath(song, sFields.category)
    )
  );
  const artists = uniq(songs.map((song) => getByPath(song, sFields.artist)));
  const noteDesigners = uniq(
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

const songMatchesText = (song, sFields, query) => {
  if (!query) return true;
  const title = normalizeText(getByPath(song, sFields.title));
  const artist = normalizeText(getByPath(song, sFields.artist));
  return title.includes(query) || artist.includes(query);
};

const songMatchesVersion = (song, sFields, versionFilter) => {
  if (!versionFilter || versionFilter.length === 0) return true;
  return versionFilter.includes(getByPath(song, sFields.version));
};

const songMatchesType = (song, sFields, typeFilter) => {
  if (!typeFilter || typeFilter.length === 0) return true;
  const value =
    getByPath(song, sFields.type) ?? getByPath(song, sFields.category);
  return typeFilter.includes(value);
};

const songMatchesArtist = (song, sFields, artistQuery) => {
  if (!artistQuery) return true;
  return normalizeText(getByPath(song, sFields.artist)).includes(
    normalizeText(artistQuery)
  );
};

const songMatchesBpm = (song, bpmMin, bpmMax) => {
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

const sheetMatchesNoteDesigner = (sheet, shFields, filter) => {
  if (!filter || filter.length === 0) return true;
  return filter.includes(getByPath(sheet, shFields.noteDesigner));
};

const sheetMatchesDifficulty = (sheet, shFields, filter) => {
  if (!filter || filter.length === 0) return true;
  return filter.includes(getByPath(sheet, shFields.difficulty));
};

const sheetMatchesLevel = (sheet, config, range) => {
  if (isDefaultLevelRange(range, config)) return true;
  const level = readSheetLevel(sheet, config);
  if (level === null) return false;
  return level >= range[0] && level <= range[1];
};

export const applySongFilters = (songs, filters, config) => {
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
    .filter(Boolean);
};

export const expandFilteredSongsToSheets = (filteredSongs) => {
  if (!filteredSongs) return [];
  const sheets = [];
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

export const sortSheets = (sheets, sortBy, sortDir, config) => {
  const dir = sortDir === 'ASC' ? 1 : -1;
  const shFields = sheetFields(config);
  const shLevel = (sheet) => {
    const value =
      getByPath(sheet, shFields.internalLevelValue) ??
      getByPath(sheet, shFields.levelValue) ??
      safeNumber(getByPath(sheet, shFields.level));
    return value;
  };
  const byStableSheet = (a, b) =>
    compareText(a.songTitle, b.songTitle, 1) ||
    compareText(a.difficulty, b.difficulty, 1) ||
    compareText(a.id, b.id, 1);
  const withFallback = (compare) => (a, b) => compare(a, b) || byStableSheet(a, b);
  const compareVersion = (a, b) => {
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
  const compareOrdered = (path, order) => withFallback((a, b) => {
    if (!order || order.length === 0) return compareText(getByPath(a, path), getByPath(b, path), dir);
    const aValue = getByPath(a, path);
    const bValue = getByPath(b, path);
    const aIndex = order.indexOf(aValue);
    const bIndex = order.indexOf(bValue);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      if (aIndex !== bIndex) return (aIndex - bIndex) * dir;
    }
    return compareText(aValue, bValue, dir);
  });
  const comparePathNumber = (path) =>
    withFallback((a, b) => compareNumber(getByPath(a, path), getByPath(b, path), dir));

  const compareFns = {
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

export const buildActiveFilterTags = (filters, config) => {
  const tags = [];

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

export const clearFilter = (key, config) => {
  if (key === 'searchText') return '';
  if (key === 'artistFilter') return '';
  if (key === 'levelRange') return [...(config.levelRange.default || [1, 20])];
  if (key === 'bpmRange') return { bpmMin: null, bpmMax: null };
  return [];
};
