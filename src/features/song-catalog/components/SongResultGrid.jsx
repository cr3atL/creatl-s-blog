import React from 'react';

const levelLabel = (sheet) => {
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

const SongResultGrid = ({ sheets, onSelect }) => {
  if (!sheets || sheets.length === 0) {
    return (
      <p className="song-catalog-empty">
        ! 无结果 - 请调整或清空筛选条件。
      </p>
    );
  }
  return (
    <ul className="song-catalog-grid" aria-label="sheet grid">
      {sheets.map((sheet, index) => {
        const key = [
          sheet.songId,
          sheet.id,
          sheet.difficulty,
          sheet.internalLevelValue ?? sheet.levelValue ?? sheet.level,
          index,
        ].join('-');
        return (
          <li key={key} className="song-catalog-grid__item">
            <button
              type="button"
              className="song-catalog-grid__card"
              onClick={() => onSelect(sheet)}
              aria-label={`Open sheet ${sheet.songTitle} (${sheet.difficulty})`}
            >
              <div className="song-catalog-grid__cover">
                {sheet.songImageUrl ? (
                  <img
                    src={sheet.songImageUrl}
                    alt=""
                    loading="lazy"
                    className="song-catalog-grid__cover-img"
                  />
                ) : (
                  <span className="song-catalog-grid__cover-fallback">无封面</span>
                )}
              </div>
              <div className="song-catalog-grid__meta">
                <span className="song-catalog-grid__diff">
                  {sheet.difficulty}
                </span>
                <span className="song-catalog-grid__level">
                  {levelLabel(sheet)}
                </span>
              </div>
              <h3 className="song-catalog-grid__title" title={sheet.songTitle}>
                {sheet.songTitle}
              </h3>
              <p
                className="song-catalog-grid__artist"
                title={sheet.songArtist}
              >
                {sheet.songArtist}
              </p>
              <p
                className="song-catalog-grid__version"
                title={`${sheet.songVersion} · ${sheet.songType}`}
              >
                {sheet.songVersion} · {sheet.songType}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default SongResultGrid;
