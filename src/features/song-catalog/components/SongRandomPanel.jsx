import React from 'react';
import SongCover from './SongCover';

const formatTime = (iso) => {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    const pad = (value) => String(value).padStart(2, '0');
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-') + ` ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch (err) {
    return '—';
  }
};

const levelLabel = (entry) => {
  if (typeof entry.level === 'number') return entry.level.toFixed(1);
  if (entry.levelLabel) return entry.levelLabel;
  return '—';
};

const sheetLevelLabel = (sheet) => {
  if (
    sheet.internalLevelValue !== null &&
    sheet.internalLevelValue !== undefined
  ) {
    return sheet.internalLevelValue.toFixed(1);
  }
  if (sheet.levelValue !== null && sheet.levelValue !== undefined) {
    return sheet.levelValue.toFixed(1);
  }
  return sheet.level || '—';
};

const allDifficultyText = (entry) => {
  if (!Array.isArray(entry.songSheets) || entry.songSheets.length === 0) {
    return '—';
  }
  const showType = new Set(entry.songSheets.map((sheet) => sheet.type)).size > 1;
  return entry.songSheets
    .map((sheet) => {
      const picked = sheet.id === entry.sheetId ? ' *' : '';
      return `${showType ? `${sheet.type.toUpperCase()} ` : ''}${sheet.difficulty} ${sheetLevelLabel(sheet)}${picked}`;
    })
    .join(' / ');
};

const SongRandomPanel = ({
  history,
  latest,
  onDrawAgain,
  canDraw,
  isDrawing,
  onClearHistory,
  onSelectEntry,
  maxHistory = 50,
}) => {
  const historyCap = Math.min(history.length, maxHistory);
  return (
    <aside className="song-catalog-random" aria-label="随机谱面历史">
      <header className="song-catalog-random__head">
        <h2 className="song-catalog-random__title">随机谱面</h2>
      </header>

      <div className="song-catalog-random__drawbar">
        <button
          type="button"
          className="song-catalog-random__action song-catalog-random__action--primary"
          onClick={onDrawAgain}
          disabled={!canDraw || isDrawing}
          aria-busy={isDrawing}
        >
          {isDrawing ? '抽取中…' : latest ? '再抽一次' : '随机抽谱面'}
        </button>
      </div>

      {latest ? (
        <div key={`${latest.sheetId}-${latest.drawnAt}`} className="song-catalog-random__latest motion-feedback">
          <SongCover className="song-catalog-random__cover" src={latest.imageUrl || latest.songImageUrl} />
          <p className="song-catalog-random__latest-title">{latest.title}</p>
          <p className="song-catalog-random__latest-artist">
            {latest.artist || '—'}
          </p>
          <p className="song-catalog-random__latest-meta">
            {latest.songVersion || '—'} · {latest.songType || latest.songCategory || '—'} · BPM {latest.bpm ?? '—'}
          </p>
          <p className="song-catalog-random__latest-picked">
            {latest.difficulty} {levelLabel(latest)}
          </p>
          <p className="song-catalog-random__latest-difficulties">
            全部难度：{allDifficultyText(latest)}
          </p>
          <p className="song-catalog-random__latest-time">
            抽选时间 {formatTime(latest.drawnAt)}
          </p>
          <div className="song-catalog-random__actions">
            <button
              type="button"
              className="song-catalog-random__action"
              onClick={() => onSelectEntry(latest)}
            >
              打开谱面
            </button>
          </div>
        </div>
      ) : null}

      <section className="song-catalog-random__history">
        <header className="song-catalog-random__history-head">
          <h3 className="song-catalog-random__history-title">历史记录</h3>
          <span className="song-catalog-random__history-count">
            {historyCap} / {maxHistory} 条
          </span>
        </header>
        {history.length === 0 ? (
          <p className="song-catalog-random__empty">暂无历史</p>
        ) : (
          <ul className="song-catalog-random__list">
            {history.slice(0, maxHistory).map((entry, index) => {
              const key = `${entry.sheetId}-${entry.drawnAt}`;
              return (
                <li key={`${key}-${index}`} className="song-catalog-random__item">
                  <button
                    type="button"
                    className="song-catalog-random__item-button"
                    onClick={() => onSelectEntry(entry)}
                  >
                    <span className="song-catalog-random__item-time">
                      {formatTime(entry.drawnAt)}
                    </span>
                    <span className="song-catalog-random__item-title">
                      {entry.title}
                    </span>
                    <span className="song-catalog-random__item-diff">
                      {entry.difficulty} · LV {levelLabel(entry)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {history.length > 0 && (
          <button
            type="button"
            className="song-catalog-random__clear"
            onClick={onClearHistory}
          >
            清空历史
          </button>
        )}
      </section>
    </aside>
  );
};

export default SongRandomPanel;
