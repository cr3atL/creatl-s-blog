import React from 'react';

// Archive Terminal section header
// 左侧显示档案站编号 + 名称，右侧可放置状态或元数据。
// 视觉：细线下划、mono 字、琥珀色编号强调。
// id 透传到 Heading，便于父级 section 使用 aria-labelledby。
const SectionHeader = ({
  number,
  title,
  meta,
  level = 2,
  as: Heading = 'h2',
  id,
}) => (
  <header className="archive-section-header" data-level={level}>
    <div className="archive-section-header__lead">
      <span className="archive-section-header__number">{number}</span>
      <span className="archive-section-header__divider" aria-hidden="true">
        /
      </span>
      <Heading className="archive-section-header__title" id={id}>
        {title}
      </Heading>
    </div>
    {meta && <div className="archive-section-header__meta">{meta}</div>}
  </header>
);

export default SectionHeader;
