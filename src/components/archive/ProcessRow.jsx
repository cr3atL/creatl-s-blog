import React from 'react';
import { Button } from 'antd';
import StatusTag from './StatusTag';

// Archive Terminal process row
// 用于首页和工具页的入口，替代原本的卡片网格。
// 视觉：编号 / 分类 / 标题 / 简介 / 状态 / 打开按钮
// onOpen 只接收 path，analytics label 由数据层（src/data/tools.js）负责。
const ProcessRow = ({
  number,
  category,
  title,
  description,
  status,
  buttonLabel = 'OPEN',
  onOpen,
  path,
}) => {
  const handleClick = () => {
    if (onOpen) {
      onOpen(path);
    }
  };

  return (
    <article className="process-row" data-status={status}>
      <div className="process-row__meta">
        <span className="process-row__label">PROCESS</span>
        <span className="process-row__number">{number}</span>
        <span className="process-row__divider" aria-hidden="true">
          /
        </span>
        <span className="process-row__category">{category}</span>
      </div>
      <div className="process-row__body">
        <h3 className="process-row__title">{title}</h3>
        {description && (
          <p className="process-row__description">{description}</p>
        )}
      </div>
      <div className="process-row__action">
        <StatusTag status={status} />
        <Button
          type="primary"
          onClick={handleClick}
          className="process-row__button"
          aria-label={`${buttonLabel} ${title} (${status})`}
        >
          {buttonLabel}
        </Button>
      </div>
    </article>
  );
};

export default ProcessRow;
