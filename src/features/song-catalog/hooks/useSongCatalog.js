import { useCallback, useEffect, useRef, useState } from 'react';

import { normalizeSongData } from '../utils/normalizeSongData';

const initialState = {
  data: null,
  loading: true,
  error: null,
};

// Fetch a single game's data.json, normalize it, and expose the
// standard { songs, updateTime } shape. The hook never throws and
// always returns a stable structure so the UI can render a single
// loading/error/data state machine. The hook also exposes a `refetch`
// callback so the error state can offer a retry button.

const useSongCatalog = (game) => {
  const [state, setState] = useState(initialState);
  const tokenRef = useRef(0);

  const load = useCallback(
    (gameRef) => {
      if (!gameRef) {
        setState({ data: null, loading: false, error: 'Unknown game.' });
        return;
      }
      const token = tokenRef.current + 1;
      tokenRef.current = token;
      setState({ data: null, loading: true, error: null });

      (async () => {
        try {
          const response = await fetch(`${gameRef.dataSource}/data.json`);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const raw = await response.json();
          const normalized = normalizeSongData(raw, gameRef.dataSource);
          if (tokenRef.current !== token) return;
          setState({ data: normalized, loading: false, error: null });
        } catch (err) {
          if (tokenRef.current !== token) return;
          setState({
            data: null,
            loading: false,
            error: `Failed to load ${gameRef.label} (${err.message}).`,
          });
        }
      })();
    },
    []
  );

  useEffect(() => {
    load(game);
  }, [game, load]);

  const refetch = useCallback(() => {
    load(game);
  }, [game, load]);

  return { ...state, refetch };
};

export default useSongCatalog;
