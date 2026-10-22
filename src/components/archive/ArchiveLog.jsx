import React from 'react';

// Archive Terminal Archive Log
// 渲染档案站动态列表，按数据顺序展示。
// 每条记录：日期 / 分类 / 标题 / 摘要。
// 视觉与 plan 8 节一致：`2026.06 / THEME / Archive Terminal 重构中`。
const ArchiveLog = ({ entries, labelledBy }) => {
  if (!entries || entries.length === 0) {
    return (
      <p className="archive-log__empty">
        [EMPTY] no archive log entries registered
      </p>
    );
  }

  const listProps = labelledBy
    ? { 'aria-labelledby': labelledBy }
    : { 'aria-label': 'archive log entries' };

  return (
    <ol className="archive-log" {...listProps}>
      {entries.map((entry) => (
        <li key={entry.id} className="archive-log__entry">
          <div className="archive-log__date">
            <span className="archive-log__date-value">{entry.date}</span>
            <span className="archive-log__divider" aria-hidden="true">
              /
            </span>
            <span className="archive-log__category">{entry.category}</span>
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
