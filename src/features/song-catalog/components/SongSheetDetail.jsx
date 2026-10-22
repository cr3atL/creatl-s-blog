import React, { useRef } from 'react';

import useFocusTrap from '../../../hooks/useFocusTrap';

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

const SongSheetDetail = ({ sheet, onClose }) => {
  const panelRef = useRef(null);
  useFocusTrap(Boolean(sheet), onClose, panelRef);

  if (!sheet) return null;
  return (
    <div
      className="song-catalog-detail__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="谱面详情"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="song-catalog-detail__panel"
        role="document"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="song-catalog-detail__head">
          <div>
            <span className="song-catalog-detail__eyebrow">谱面详情</span>
            <h2 className="song-catalog-detail__title">{sheet.songTitle}</h2>
            <p className="song-catalog-detail__artist">{sheet.songArtist}</p>
          </div>
          <button
            type="button"
            className="song-catalog-detail__close"
            onClick={onClose}
            aria-label="关闭详情"
          >
            [ × ]
          </button>
        </header>

        <dl className="song-catalog-detail__meta">
          <div>
            <dt>难度</dt>
            <dd>{sheet.difficulty}</dd>
          </div>
          <div>
            <dt>等级</dt>
            <dd>{levelLabel(sheet)}</dd>
          </div>
          <div>
            <dt>版本</dt>
            <dd>{sheet.songVersion || '—'}</dd>
          </div>
          <div>
            <dt>类型</dt>
            <dd>{sheet.songType || '—'}</dd>
          </div>
          <div>
            <dt>BPM</dt>
            <dd>{sheet.songBpm ?? '—'}</dd>
          </div>
          <div>
            <dt>谱师</dt>
            <dd>{sheet.noteDesigner || '—'}</dd>
          </div>
          <div>
            <dt>物量</dt>
            <dd>{sheet.notes ?? '—'}</dd>
          </div>
        </dl>

        <div className="song-catalog-detail__cover">
          {sheet.songImageUrl ? (
            <img
              src={sheet.songImageUrl}
              alt=""
              className="song-catalog-detail__cover-img"
            />
          ) : (
            <span className="song-catalog-detail__cover-fallback">无封面</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongSheetDetail;
