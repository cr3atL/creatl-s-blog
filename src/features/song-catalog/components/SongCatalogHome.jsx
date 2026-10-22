import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ResponsiveLayout from '../../../components/ResponsiveLayout';
import games from '../config/games';
import '../styles/song-catalog.css';

const countSheets = (raw) => {
  if (!raw || !Array.isArray(raw.songs)) return 0;
  return raw.songs.reduce(
    (sum, song) => sum + (Array.isArray(song.sheets) ? song.sheets.length : 0),
    0
  );
};

const useSheetCounts = () => {
  const [counts, setCounts] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const next = {};
      await Promise.all(
        games.map(async (game) => {
          try {
            const res = await fetch(`${game.dataSource}/data.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            next[game.id] = countSheets(raw);
          } catch (err) {
            next[game.id] = null;
          }
        })
      );
      if (!cancelled) {
        setCounts(next);
        setReady(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, ready };
};

const formatCount = (value) => {
  if (value === null || value === undefined) return '— 张谱面';
  return `${value} 张谱面`;
};

const SongCatalogHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameButtons = useRef(new Map());
  const { counts, ready } = useSheetCounts();
  useEffect(() => {
    gameButtons.current.get(location.state?.catalogGameId)?.focus();
  }, [location.state?.catalogGameId]);

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium song-catalog-home">
        <header className="song-catalog-home__header" data-motion-section>
          <h1 className="song-catalog-home__title">音游曲库</h1>
        </header>

        <ul className="song-catalog-home__grid" aria-label="可用游戏" data-motion-section>
          {games.map((game) => {
            const value = counts[game.id];
            return (
              <li key={game.id} className="song-catalog-home__item">
                <button
                  type="button"
                  ref={(button) => { if (button) gameButtons.current.set(game.id, button); else gameButtons.current.delete(game.id); }}
                  className="song-catalog-home__card"
                  onClick={() => navigate(game.path)}
                  aria-label={`打开 ${game.label} 曲库`}
                >
                  <div className="song-catalog-home__icon-frame">
                    <img
                      src={game.icon}
                      alt=""
                      className="song-catalog-home__icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="song-catalog-home__meta">
                    <span className="song-catalog-home__label">{game.label}</span>
                  </div>
                  <div className="song-catalog-home__footer">
                    <span className="song-catalog-home__count">
                      {ready ? formatCount(value) : '统计中...'}
                    </span>
                    <span className="song-catalog-home__open">打开</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <footer className="song-catalog-home__sources" aria-label="数据来源" data-motion-section>
          <span>数据：cloudfront CDN (arcade-songs mirror)</span>
          {games.map((game) => <a key={game.id} href={game.iconUrl} target="_blank" rel="noreferrer">{game.label} 图标</a>)}
        </footer>
      </div>
    </ResponsiveLayout>
  );
};

export default SongCatalogHome;
