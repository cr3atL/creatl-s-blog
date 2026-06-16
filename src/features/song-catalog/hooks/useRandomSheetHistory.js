import { useCallback, useEffect, useState } from 'react';

import { trimHistory } from '../utils/randomSheet';

export const STORAGE_PREFIX = 'creatl.songCatalog.randomHistory';
export const STORAGE_VERSION = 1;
export const MAX_HISTORY = 50;

const buildKey = (gameId) => `${STORAGE_PREFIX}.${gameId}`;

const safeRead = (gameId) => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(buildKey(gameId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.__v !== STORAGE_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }
    return parsed.items;
  } catch (err) {
    return [];
  }
};

const safeWrite = (gameId, items) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
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

const useRandomSheetHistory = (gameId) => {
  const [history, setHistory] = useState(() => safeRead(gameId));

  useEffect(() => {
    setHistory(safeRead(gameId));
  }, [gameId]);

  // Cross-tab sync: when another tab updates the same key, pull the new
  // payload into this tab's state so the panel stays consistent.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleStorage = (event) => {
      if (!event || event.key !== buildKey(gameId)) return;
      setHistory(safeRead(gameId));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [gameId]);

  const persist = useCallback(
    (updater) => {
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
    (entry) => {
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
