import type { Game, CatalogData } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';

import { normalizeSongData } from '../utils/normalizeSongData';

interface CatalogState { data: CatalogData | null; loading: boolean; error: string | null; gameId?: string }
const initialState: CatalogState = {
  data: null,
  loading: true,
  error: null,
};

// Fetch a single game's data.json, normalize it, and expose the
// standard { songs, updateTime } shape. The hook never throws and
// always returns a stable structure so the UI can render a single
// loading/error/data state machine. The hook also exposes a `refetch`
// callback so the error state can offer a retry button.

const useSongCatalog = (game: Game | undefined) => {
  const [state, setState] = useState(initialState);
  const tokenRef = useRef(0);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(
    (gameRef: Game | undefined) => {
      requestRef.current?.abort();
      const token = ++tokenRef.current;
      if (!gameRef) {
        setState({ data: null, loading: false, error: '未知游戏。' });
        return;
      }
      const controller = new AbortController();
      requestRef.current = controller;
      setState({ data: null, loading: true, error: null, gameId: gameRef.id });

      (async () => {
        try {
          const response = await fetch(`${gameRef.dataSource}/data.json`, { signal: controller.signal });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const raw = await response.json();
          const normalized = normalizeSongData(raw, gameRef.dataSource);
          if (tokenRef.current !== token) return;
          setState({ data: normalized, loading: false, error: null, gameId: gameRef.id });
        } catch (err) {
          if (tokenRef.current !== token) return;
          setState({
            data: null,
            loading: false,
            gameId: gameRef.id,
            error: `无法加载 ${gameRef.label}（${err instanceof Error ? err.message : String(err)}）。`,
          });
        }
      })();
    },
    []
  );

  useEffect(() => {
    load(game);
    return () => { ++tokenRef.current; requestRef.current?.abort(); };
  }, [game, load]);

  const refetch = useCallback(() => {
    load(game);
  }, [game, load]);

  return { ...(state.gameId === game?.id ? state : initialState), refetch };
};

export default useSongCatalog;
