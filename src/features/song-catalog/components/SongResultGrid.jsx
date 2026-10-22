import React from 'react';
import SongCover from './SongCover';
import { getSheetKey } from '../utils/sheetIdentity';

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

const SongResultGrid = ({ sheets, onSelect, gameId = '' }) => {
  if (!sheets || sheets.length === 0) {
    return (
      <p className="song-catalog-empty">
        无结果，请调整或清空筛选条件。
      </p>
    );
  }
  return (
    <ul className="song-catalog-grid" aria-label="谱面网格">
      {sheets.map((sheet) => {
        const key = getSheetKey(sheet, gameId);
        return (
          <li key={key} className="song-catalog-grid__item">
            <button
              type="button"
              className="song-catalog-grid__card"
              onClick={() => onSelect(sheet)}
              aria-label={`打开谱面 ${sheet.songTitle} (${sheet.difficulty})`}
            >
              <SongCover src={sheet.imageUrl || sheet.songImageUrl} />
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
