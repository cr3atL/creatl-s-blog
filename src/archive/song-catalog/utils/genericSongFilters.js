const getByPath = (item, path) => {
  if (!path) {
    return undefined;
  }

  if (typeof path === 'function') {
    return path(item);
  }

  return String(path)
    .split('.')
    .reduce((value, key) => value?.[key], item);
};

const uniqTruthy = (values) => [...new Set(values)].filter(Boolean);

const normalizeText = (value) => String(value || '').toLowerCase();

const getSongFields = (config) => config.fields?.song || {};

const getSheetFields = (config) => config.fields?.sheet || {};

export const createDefaultSongFilters = (config) => ({
  searchText: '',
  difficultyFilter: [],
  versionFilter: [],
  typeFilter: [],
  levelRange: [...config.levelRange.default],
});

export const createSongFilterOptions = (songs, config) => {
  const songFields = getSongFields(config);
  const sheetFields = getSheetFields(config);

  return {
    difficulties: uniqTruthy(
      songs.flatMap((song) =>
        (getByPath(song, songFields.sheets) || []).map((sheet) =>
          getByPath(sheet, sheetFields.difficulty)
        )
      )
    ),
    versions: uniqTruthy(songs.map((song) => getByPath(song, songFields.version))),
    types: uniqTruthy(
      songs.map((song) =>
        getByPath(song, songFields.type) ?? getByPath(song, songFields.category)
      )
    ),
  };
};

const readSheetLevel = (sheet, config) => {
  const sheetFields = getSheetFields(config);
  const value =
    getByPath(sheet, sheetFields.internalLevelValue) ??
    getByPath(sheet, sheetFields.levelValue) ??
    getByPath(sheet, sheetFields.level);
  const numberValue = typeof value === 'number' ? value : parseFloat(value);

  return Number.isNaN(numberValue) ? null : numberValue;
};

const isDefaultLevelRange = (filters, config) =>
  filters.levelRange[0] === config.levelRange.default[0] &&
  filters.levelRange[1] === config.levelRange.default[1];

const sheetMatches = (sheet, filters, config) => {
  const sheetFields = getSheetFields(config);

  if (
    filters.difficultyFilter.length > 0 &&
    !filters.difficultyFilter.includes(getByPath(sheet, sheetFields.difficulty))
  ) {
    return false;
  }

  if (!isDefaultLevelRange(filters, config)) {
    const level = readSheetLevel(sheet, config);
    if (
      level === null ||
      level < filters.levelRange[0] ||
      level > filters.levelRange[1]
    ) {
      return false;
    }
  }

  return true;
};

const songMatches = (song, filters, config) => {
  const songFields = getSongFields(config);
  const query = normalizeText(filters.searchText);

  if (query) {
    const title = normalizeText(getByPath(song, songFields.title));
    const artist = normalizeText(getByPath(song, songFields.artist));
    if (!title.includes(query) && !artist.includes(query)) {
      return false;
    }
  }

  if (
    filters.versionFilter.length > 0 &&
    !filters.versionFilter.includes(getByPath(song, songFields.version))
  ) {
    return false;
  }

  if (filters.typeFilter.length > 0) {
    const type = getByPath(song, songFields.type) ?? getByPath(song, songFields.category);
    if (!filters.typeFilter.includes(type)) {
      return false;
    }
  }

  return true;
};

export const applySongFilters = (songs, filters, config) => {
  const songFields = getSongFields(config);
  const hasSheetFilters =
    filters.difficultyFilter.length > 0 || !isDefaultLevelRange(filters, config);

  return songs
    .filter((song) => songMatches(song, filters, config))
    .map((song) => {
      if (!hasSheetFilters) {
        return song;
      }

      const sheets = getByPath(song, songFields.sheets) || [];
      const matchedSheets = sheets.filter((sheet) => sheetMatches(sheet, filters, config));

      if (config.sheetMatchBehavior === 'prune') {
        return matchedSheets.length > 0 ? { ...song, sheets: matchedSheets } : null;
      }

      return matchedSheets.length > 0 ? song : null;
    })
    .filter(Boolean);
};

export const getActiveSongFilterTags = (filters, config) => {
  const tags = [];

  if (filters.searchText) {
    tags.push({ key: 'searchText', label: '搜索', value: filters.searchText, color: 'blue' });
  }

  if (filters.difficultyFilter.length > 0) {
    tags.push({
      key: 'difficultyFilter',
      label: '难度',
      value: filters.difficultyFilter.join(', '),
      color: config.getDifficultyColor?.(filters.difficultyFilter[0]) || 'default',
      className: config.getDifficultyClassName?.(filters.difficultyFilter[0]) || '',
    });
  }

  if (filters.versionFilter.length > 0) {
    tags.push({
      key: 'versionFilter',
      label: '版本',
      value: filters.versionFilter.join(', '),
      color: config.getVersionColor?.(filters.versionFilter[0]) || 'default',
    });
  }

  if (filters.typeFilter.length > 0) {
    tags.push({
      key: 'typeFilter',
      label: '类型',
      value: filters.typeFilter.join(', '),
      color: config.getTypeColor?.(filters.typeFilter[0]) || 'default',
      className: config.getTypeClassName?.(filters.typeFilter[0]) || '',
    });
  }

  if (!isDefaultLevelRange(filters, config)) {
    tags.push({
      key: 'levelRange',
      label: '等级',
      value: `${filters.levelRange[0]} - ${filters.levelRange[1]}`,
      color: 'purple',
    });
  }

  return tags;
};

export const countActiveSongFilters = (filters, config) =>
  getActiveSongFilterTags(filters, config).length;
