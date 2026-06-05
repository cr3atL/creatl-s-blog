import React from 'react';

// Archive Terminal 状态标签
// READY = 琥珀 / DRAFT = 冷青 / ARCHIVED = 灰 / COMING SOON = 琥珀描边
// 默认按 status 切换颜色，保证视觉一致。
const variantByStatus = {
  READY: 'archive-status--ready',
  DRAFT: 'archive-status--draft',
  ARCHIVED: 'archive-status--archived',
  'COMING SOON': 'archive-status--soon',
};

const StatusTag = ({ status, children }) => {
  const variant = variantByStatus[status] || 'archive-status--ready';
  return (
    <span className={`archive-status ${variant}`}>
      <span className="archive-status__dot" aria-hidden="true" />
      <span className="archive-status__label">{children || status}</span>
    </span>
  );
};

export default StatusTag;
