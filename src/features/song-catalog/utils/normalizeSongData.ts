import type { CatalogData, NoteCounts, Sheet, Song } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const metadataList = <K extends string>(value: unknown, key: K): (Record<K, string> & Record<string, unknown>)[] =>
  Array.isArray(value) ? value.filter((item): item is Record<K, string> & Record<string, unknown> =>
    isRecord(item) && typeof item[key] === 'string') : [];

// Normalize remote song payloads so the filter & result layer never
// reaches into game-specific shapes. The data source is the public
// arcade-songs CDN; the original payloads occasionally miss fields
// (no image, no BPM, etc.) and we want a consistent shape downstream.

const safeString = (value: unknown) => (value === null || value === undefined ? '' : String(value));

const safeNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
};

const buildImageUrl = (dataSource: string, imageName: unknown) => {
  if (!imageName) return null;
  return `${dataSource}/img/cover/${imageName}`;
};

const computeNotePercents = (noteCounts: NoteCounts | null): NoteCounts | null => {
  if (!noteCounts || noteCounts.total === null || noteCounts.total === undefined) {
    return null;
  }
  const total = noteCounts.total;
  return Object.fromEntries(
    Object.entries(noteCounts).map(([key, value]) => [
      key,
      value === null || value === undefined ? null : Number(value) / total,
    ])
  );
};

export const normalizeSong = (rawSong: unknown, dataSource: string, songNo = 0): Song | null => {
  if (!isRecord(rawSong)) return null;

  const title = safeString(rawSong.title);
  const artist = safeString(rawSong.artist);
  const version = safeString(rawSong.version) || 'UNKNOWN';
  const type = safeString(rawSong.type) || safeString(rawSong.category) || 'UNKNOWN';

  const rawSheets = Array.isArray(rawSong.sheets) ? rawSong.sheets : [];
  const sheets = rawSheets
    .map((sheet) => normalizeSheet(sheet, dataSource, type))
    .filter((item) => item !== null);

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

export const normalizeSheet = (rawSheet: unknown, dataSource: string, fallbackType: string): Sheet | null => {
  if (!isRecord(rawSheet)) return null;
  const noteCounts: NoteCounts | null = isRecord(rawSheet.noteCounts)
    ? Object.fromEntries(Object.entries(rawSheet.noteCounts).map(([key, value]) => [key, safeNumber(value)]))
    : null;

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
    noteCounts: noteCounts,
    notePercents: computeNotePercents(noteCounts),
    imageUrl: buildImageUrl(dataSource, rawSheet.imageName),
  };
};

export const normalizeSongData = (rawData: unknown, dataSource: string): CatalogData => {
  if (!isRecord(rawData) || !Array.isArray(rawData.songs)) {
    return { songs: [], categories: [], versions: [], types: [], difficulties: [],
      updateTime: safeString(isRecord(rawData) ? rawData.updateTime : '') };
  }

  const songs = rawData.songs
    .map((song, index) => normalizeSong(song, dataSource, index + 1))
    .filter((item) => item !== null);

  return {
    songs,
    categories: metadataList(rawData.categories, 'category'),
    versions: metadataList(rawData.versions, 'version'),
    types: metadataList(rawData.types, 'type'),
    difficulties: metadataList(rawData.difficulties, 'difficulty'),
    updateTime: safeString(rawData.updateTime),
  };
};

export default normalizeSongData;
