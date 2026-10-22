import type { HistoryEntry } from '../utils/randomSheet';
import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { trimHistory } from '../utils/randomSheet';

export const STORAGE_PREFIX = 'creatl.songCatalog.randomHistory';
export const STORAGE_VERSION = 1;
export const MAX_HISTORY = 50;

const buildKey = (gameId: string) => `${STORAGE_PREFIX}.${gameId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const nullableNumber = (value: unknown) => value === null || typeof value === 'number';
const nullableString = (value: unknown) => value === null || typeof value === 'string';

const isHistoryEntry = (value: unknown): value is HistoryEntry => {
  if (!isRecord(value)) return false;
  const strings = ['sheetId', 'songId', 'title', 'artist', 'difficulty', 'levelLabel',
    'songVersion', 'songType', 'songCategory', 'noteDesigner', 'drawnAt'];
  return strings.every((key) => typeof value[key] === 'string') &&
    nullableNumber(value.level) && nullableNumber(value.bpm) && nullableNumber(value.notes) &&
    nullableString(value.imageUrl) && nullableString(value.songImageUrl) &&
    Array.isArray(value.songSheets) && value.songSheets.every((sheet: unknown) => {
      if (!isRecord(sheet)) return false;
      return ['id', 'difficulty', 'level', 'type', 'noteDesigner'].every((key) => typeof sheet[key] === 'string') &&
        nullableNumber(sheet.levelValue) && nullableNumber(sheet.internalLevelValue) && nullableNumber(sheet.notes) &&
        ['noteCounts', 'notePercents'].every((key) => sheet[key] === null ||
          (isRecord(sheet[key]) && Object.values(sheet[key]).every(nullableNumber)));
    });
};

const safeRead = (gameId: string): HistoryEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(buildKey(gameId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.__v !== STORAGE_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }
    return parsed.items.filter(isHistoryEntry);
  } catch (err) {
    return [];
  }
};

const safeWrite = (gameId: string, items: HistoryEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      __v: STORAGE_VERSION,
      items: trimHistory(items, MAX_HISTORY),
    };
    window.localStorage.setItem(buildKey(gameId), JSON.stringify(payload));
  } catch (err) {
    // storage may be full or disabled; swallow to avoid breaking the UI.
  }
};

const useRandomSheetHistory = (gameId: string) => {
  const [history, setHistory] = useState(() => safeRead(gameId));

  useEffect(() => {
    setHistory(safeRead(gameId));
  }, [gameId]);

  // Cross-tab sync: when another tab updates the same key, pull the new
  // payload into this tab's state so the panel stays consistent.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleStorage = (event: StorageEvent) => {
      if (!event || event.key !== buildKey(gameId)) return;
      setHistory(safeRead(gameId));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [gameId]);

  const persist = useCallback(
    (updater: SetStateAction<HistoryEntry[]>) => {
      setHistory((current) => {
        const next = typeof updater === 'function' ? updater(current) : updater;
        const trimmed = trimHistory(next, MAX_HISTORY);
        safeWrite(gameId, trimmed);
        return trimmed;
      });
    },
    [gameId]
  );

  const addEntry = useCallback(
    (entry: HistoryEntry | null) => {
      if (!entry) return;
      persist((current) => [entry, ...current]);
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  return { history, addEntry, clearAll };
};

export default useRandomSheetHistory;
