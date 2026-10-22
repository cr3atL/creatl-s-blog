import React from 'react';

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
  return entry.songSheets
    .map((sheet) => {
      const picked = sheet.id === entry.sheetId ? ' *' : '';
      return `${sheet.difficulty} ${sheetLevelLabel(sheet)}${picked}`;
    })
    .join(' / ');
};

const SongRandomPanel = ({
  history,
  latest,
  onDrawAgain,
  canDraw,
  onClearHistory,
  onSelectEntry,
  maxHistory = 50,
}) => {
  const historyCap = Math.min(history.length, maxHistory);
  return (
    <aside className="song-catalog-random" aria-label="随机谱面历史">
      <header className="song-catalog-random__head">
        <span className="song-catalog-random__eyebrow">随机面板</span>
        <h2 className="song-catalog-random__title">本次抽选</h2>
      </header>

      <div className="song-catalog-random__drawbar">
        <button
          type="button"
          className="song-catalog-random__action song-catalog-random__action--primary"
          onClick={onDrawAgain}
          disabled={!canDraw}
        >
          {latest ? '再抽一次' : '随机抽谱面'}
        </button>
      </div>

      {latest ? (
        <div className="song-catalog-random__latest">
          <div className="song-catalog-random__cover">
            {latest.songImageUrl || latest.imageUrl ? (
              <img
                src={latest.songImageUrl || latest.imageUrl}
                alt=""
                className="song-catalog-random__cover-img"
              />
            ) : (
              <span className="song-catalog-random__cover-fallback">
                无封面
              </span>
            )}
          </div>
          <p className="song-catalog-random__latest-title">{latest.title}</p>
          <p className="song-catalog-random__latest-artist">
            {latest.artist || '—'}
          </p>
          <p className="song-catalog-random__latest-meta">
            {latest.songVersion || '—'} · {latest.songType || latest.songCategory || '—'} · BPM {latest.bpm ?? '—'}
          </p>
          <p className="song-catalog-random__latest-picked">
            抽中谱面：{latest.difficulty} {levelLabel(latest)}
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
      ) : (
        <p className="song-catalog-random__empty">
          点击“随机抽谱面”，从当前筛选结果中抽取一张谱面。
        </p>
      )}

      <section className="song-catalog-random__history">
        <header className="song-catalog-random__history-head">
          <h3 className="song-catalog-random__history-title">历史记录</h3>
          <span className="song-catalog-random__history-count">
            {String(historyCap).padStart(2, '0')} / {maxHistory} 条
          </span>
        </header>
        {history.length === 0 ? (
          <p className="song-catalog-random__empty">— 暂无历史 —</p>
        ) : (
          <ul className="song-catalog-random__list">
            {history.slice(0, 12).map((entry) => {
              const key = `${entry.sheetId}-${entry.drawnAt}`;
              return (
                <li key={key} className="song-catalog-random__item">
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
