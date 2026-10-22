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

const handleRowKey = (event, sheet, onSelect) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect(sheet);
  }
};

const SongResultList = ({ sheets, onSelect }) => {
  if (!sheets || sheets.length === 0) {
    return (
      <p className="song-catalog-empty">
        ! 无结果 - 请调整或清空筛选条件。
      </p>
    );
  }
  return (
    <div className="song-catalog-table-wrap" role="region" aria-label="谱面详情列表">
      <table className="song-catalog-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">曲名</th>
            <th scope="col">艺术家</th>
            <th scope="col">难度</th>
            <th scope="col">等级</th>
            <th scope="col">版本</th>
            <th scope="col" className="song-catalog-table__bpm-col">BPM</th>
            <th scope="col" className="song-catalog-table__designer-col">谱师</th>
          </tr>
        </thead>
        <tbody>
          {sheets.map((sheet, index) => {
            const key = [
              sheet.songId,
              sheet.id,
              sheet.difficulty,
              sheet.internalLevelValue ?? sheet.levelValue ?? sheet.level,
              index,
            ].join('-');
            return (
              <tr
                key={key}
                className="song-catalog-table__row"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(sheet)}
                onKeyDown={(event) => handleRowKey(event, sheet, onSelect)}
                aria-label={`打开谱面 ${sheet.songTitle} (${sheet.difficulty})`}
              >
                <td className="song-catalog-table__index">
                  {String(index + 1).padStart(4, '0')}
                </td>
                <td className="song-catalog-table__title">{sheet.songTitle}</td>
                <td className="song-catalog-table__artist">{sheet.songArtist}</td>
                <td className="song-catalog-table__diff">{sheet.difficulty}</td>
                <td className="song-catalog-table__level">{levelLabel(sheet)}</td>
                <td className="song-catalog-table__version">{sheet.songVersion}</td>
                <td className="song-catalog-table__bpm song-catalog-table__bpm-col">
                  {sheet.songBpm ?? '—'}
                </td>
                <td className="song-catalog-table__designer song-catalog-table__designer-col">
                  {sheet.noteDesigner || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SongResultList;
