import type { CatalogSheet } from '../types';

// Keep source IDs intact for persisted history. UI identity also needs the song
// and chart type: source sheet IDs are not necessarily unique across songs.
export const getSheetKey = (sheet: CatalogSheet, gameId = '') => JSON.stringify([
  gameId, sheet.songId, sheet.songType, sheet.songVersion,
  sheet.id, sheet.type, sheet.difficulty,
]);

export const sheetLevelLabel = (sheet: Pick<CatalogSheet, 'level' | 'internalLevelValue' | 'levelValue'>) =>
  sheet.level || (sheet.internalLevelValue ?? sheet.levelValue)?.toFixed(1) || '—';

export const metadataLabel = (value?: string | null) =>
  !value || value === 'UNKNOWN' || value === '-' ? '—' : value;
