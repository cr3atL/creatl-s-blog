import React from 'react';

// Keep the source order and real update content; dates identify the historical entries.
const ArchiveLog = ({ entries, labelledBy }) => {
  if (!entries || entries.length === 0) {
    return (
      <p className="archive-log__empty">
        暂无更新。
      </p>
    );
  }

  const listProps = labelledBy
    ? { 'aria-labelledby': labelledBy }
    : { 'aria-label': '更新记录' };

  return (
    <ol className="archive-log" {...listProps}>
      {entries.map((entry) => (
        <li key={entry.id} className="archive-log__entry">
          <div className="archive-log__date">
            <span className="archive-log__date-value">{entry.date}</span>
          </div>
          <div className="archive-log__body">
            <h3 className="archive-log__title">{entry.title}</h3>
            {entry.summary && (
              <p className="archive-log__summary">{entry.summary}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ArchiveLog;
