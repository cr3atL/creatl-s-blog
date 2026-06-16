// Normalize remote song payloads so the filter & result layer never
// reaches into game-specific shapes. The data source is the public
// arcade-songs CDN; the original payloads occasionally miss fields
// (no image, no BPM, etc.) and we want a consistent shape downstream.

const safeString = (value) => (value === null || value === undefined ? '' : String(value));

const safeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildImageUrl = (dataSource, imageName) => {
  if (!imageName) return null;
  return `${dataSource}/img/cover/${imageName}`;
};

const computeNotePercents = (noteCounts) => {
  if (!noteCounts || noteCounts.total === null || noteCounts.total === undefined) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(noteCounts).map(([key, value]) => [
      key,
      value === null || value === undefined ? null : Number(value) / noteCounts.total,
    ])
  );
};

export const normalizeSong = (rawSong, dataSource, songNo = 0) => {
  if (!rawSong) return null;

  const title = safeString(rawSong.title);
  const artist = safeString(rawSong.artist);
  const version = safeString(rawSong.version) || 'UNKNOWN';
  const type = safeString(rawSong.type) || safeString(rawSong.category) || 'UNKNOWN';

  const rawSheets = Array.isArray(rawSong.sheets) ? rawSong.sheets : [];
  const sheets = rawSheets
    .map((sheet) => normalizeSheet(sheet, dataSource, type))
    .filter(Boolean);

  return {
    id: safeString(rawSong.songId || rawSong.id || title),
    songId: safeString(rawSong.songId || rawSong.id || title),
    songNo,
    title,
    artist,
    version,
    releaseDate: safeString(rawSong.releaseDate),
    type,
    category: safeString(rawSong.category) || type,
    bpm: safeNumber(rawSong.bpm),
    imageUrl: buildImageUrl(dataSource, rawSong.imageName),
    sheets,
  };
};

export const normalizeSheet = (rawSheet, dataSource, fallbackType) => {
  if (!rawSheet) return null;

  const difficulty = safeString(
    rawSheet.difficulty || rawSheet.difficultyAbbr || 'UNKNOWN'
  );
  const levelValue = safeNumber(rawSheet.levelValue) ?? safeNumber(rawSheet.level);
  const internalLevelValue =
    safeNumber(rawSheet.internalLevelValue) ?? levelValue;

  return {
    id: safeString(
      rawSheet.sheetExpr ||
        rawSheet.id ||
        `${difficulty}-${levelValue ?? 'na'}-${rawSheet.noteDesigner || ''}`
    ),
    difficulty,
    level: safeString(rawSheet.level),
    levelValue,
    internalLevelValue,
    type: safeString(rawSheet.type) || fallbackType || '',
    noteDesigner: safeString(rawSheet.noteDesigner || rawSheet.charter),
    notes: safeNumber(rawSheet.notes),
    noteCounts: rawSheet.noteCounts || null,
    notePercents: computeNotePercents(rawSheet.noteCounts),
    imageUrl: buildImageUrl(dataSource, rawSheet.imageName),
  };
};

export const normalizeSongData = (rawData, dataSource) => {
  if (!rawData || !Array.isArray(rawData.songs)) {
    return { songs: [], updateTime: safeString(rawData?.updateTime) };
  }

  const songs = rawData.songs
    .map((song, index) => normalizeSong(song, dataSource, index + 1))
    .filter(Boolean);

  return {
    songs,
    categories: Array.isArray(rawData.categories) ? rawData.categories : [],
    versions: Array.isArray(rawData.versions) ? rawData.versions : [],
    types: Array.isArray(rawData.types) ? rawData.types : [],
    difficulties: Array.isArray(rawData.difficulties) ? rawData.difficulties : [],
    updateTime: safeString(rawData.updateTime),
  };
};

export default normalizeSongData;
