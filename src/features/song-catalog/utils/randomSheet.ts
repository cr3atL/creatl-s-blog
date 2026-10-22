import type { CatalogSheet } from '../types';
// Random sheet picking — always operates on the current filtered sheet
// pool. Sheet-level picking (not song-level) is the contract: each
// call returns a single sheet from the candidate pool.

export const drawRandomSheet = <T,>(sheetPool: T[]): T | null => {
  if (!Array.isArray(sheetPool) || sheetPool.length === 0) return null;
  const index = Math.floor(Math.random() * sheetPool.length);
  return sheetPool[index];
};

export const drawRandomSheets = <T,>(sheetPool: T[], count: number): T[] => {
  if (!Array.isArray(sheetPool) || sheetPool.length === 0 || count <= 0) return [];
  const result = [];
  const used = new Set();
  const limit = Math.min(count, sheetPool.length);
  while (result.length < limit) {
    const index = Math.floor(Math.random() * sheetPool.length);
    if (used.has(index)) continue;
    used.add(index);
    result.push(sheetPool[index]);
  }
  return result;
};

export const trimHistory = <T,>(history: T[], max = 50): T[] => {
  if (!Array.isArray(history)) return [];
  if (history.length <= max) return history;
  return history.slice(0, max);
};

export const buildHistoryEntry = (sheet: CatalogSheet | null) => {
  if (!sheet) return null;
  return {
    sheetId: sheet.id,
    songId: sheet.songId,
    title: sheet.songTitle,
    artist: sheet.songArtist,
    difficulty: sheet.difficulty,
    level:
      sheet.internalLevelValue !== null && sheet.internalLevelValue !== undefined
        ? sheet.internalLevelValue
        : sheet.levelValue,
    levelLabel: sheet.level,
    bpm: sheet.songBpm,
    imageUrl: sheet.imageUrl,
    songImageUrl: sheet.songImageUrl,
    songVersion: sheet.songVersion,
    songType: sheet.songType,
    songCategory: sheet.songCategory,
    songSheets: Array.isArray(sheet.songSheets) ? sheet.songSheets : [],
    noteDesigner: sheet.noteDesigner,
    notes: sheet.notes,
    drawnAt: new Date().toISOString(),
  };
};

export type HistoryEntry = NonNullable<ReturnType<typeof buildHistoryEntry>>;
