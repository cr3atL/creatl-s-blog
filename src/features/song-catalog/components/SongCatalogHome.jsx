import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  return `${String(value).padStart(4, '0')} 张谱面 →`;
};

const SongCatalogHome = () => {
  const navigate = useNavigate();
  const { counts, ready } = useSheetCounts();

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium song-catalog-home">
        <header className="song-catalog-home__header">
          <span className="song-catalog-home__eyebrow">01 / 曲库</span>
          <h1 className="song-catalog-home__title">曲库档案</h1>
          <p className="song-catalog-home__intro">
            收录 maimai DX、CHUNITHM 和 SOUND VOLTEX EXCEED GEAR 的曲目与谱面。
            可以按游戏浏览、筛选、排序，也可以随机抽一张谱面练练手。
          </p>
        </header>

        <ul className="song-catalog-home__grid" aria-label="可用游戏">
          {games.map((game, index) => {
            const value = counts[game.id];
            return (
              <li key={game.id} className="song-catalog-home__item">
                <button
                  type="button"
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
                    <span className="song-catalog-home__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="song-catalog-home__divider">/</span>
                    <span className="song-catalog-home__label">{game.label}</span>
                  </div>
                  <p className="song-catalog-home__description">
                    {game.shortDescription}
                  </p>
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

        <footer className="song-catalog-home__sources" aria-label="数据来源">
          <span className="song-catalog-home__sources-label">来源</span>
          <span className="song-catalog-home__sources-divider">/</span>
          <span>
            数据：cloudfront CDN (arcade-songs mirror) · 图标资源：src/icons
          </span>
          <span className="song-catalog-home__sources-divider">/</span>
          <span>个人 · 非商业</span>
        </footer>
      </div>
    </ResponsiveLayout>
  );
};

export default SongCatalogHome;
