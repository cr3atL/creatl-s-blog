import React from 'react';
import { Button, Col, Divider, Input, Modal, Row, Slider, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const toggleValue = (values, value) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export const SongFilterTags = ({ tags, onClear }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="song-page-active-filter-tags">
      {tags.map((tag) => (
        <Tag
          key={tag.key}
          color={tag.color}
          className={tag.className}
          closable
          onClose={() => onClear(tag.key)}
        >
          {tag.label}: {tag.value}
        </Tag>
      ))}
    </div>
  );
};

const OptionTags = ({ options, selectedValues, getColor, getClassName, onToggle }) => (
  <div className="song-page-filter-option-tags">
    {options.map((option) => (
      <Tag
        key={option}
        color={getColor?.(option) || 'default'}
        className={getClassName?.(option) || ''}
        style={{ cursor: 'pointer', marginBottom: 8 }}
        onClick={() => onToggle(toggleValue(selectedValues, option))}
      >
        {selectedValues.includes(option) ? '✓ ' : ''}
        {option}
      </Tag>
    ))}
  </div>
);

const SongFilterModal = ({
  open,
  filters,
  options,
  activeTags,
  config,
  onCancel,
  onApply,
  onReset,
  onChange,
  onClear,
}) => (
  <Modal
    title="筛选条件"
    open={open}
    onCancel={onCancel}
    footer={[
      <Button key="reset" onClick={onReset}>
        重置
      </Button>,
      <Button key="cancel" onClick={onCancel}>
        取消
      </Button>,
      <Button key="ok" type="primary" onClick={onApply}>
        确定
      </Button>,
    ]}
    width="min(640px, calc(100vw - 32px))"
  >
    <Search
      placeholder="搜索歌曲或艺术家"
      allowClear
      enterButton={<SearchOutlined />}
      value={filters.searchText}
      onChange={(event) => onChange('searchText', event.target.value)}
      onSearch={(value) => onChange('searchText', value)}
      style={{ marginBottom: 16 }}
    />

    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="song-page-filter-field">难度</div>
        <OptionTags
          options={options.difficulties}
          selectedValues={filters.difficultyFilter}
          getColor={config.getDifficultyColor}
          getClassName={config.getDifficultyClassName}
          onToggle={(value) => onChange('difficultyFilter', value)}
        />
      </Col>

      <Col span={24}>
        <div className="song-page-filter-field">版本</div>
        <OptionTags
          options={options.versions}
          selectedValues={filters.versionFilter}
          getColor={config.getVersionColor}
          onToggle={(value) => onChange('versionFilter', value)}
        />
      </Col>

      <Col span={24}>
        <div className="song-page-filter-field">类型</div>
        <OptionTags
          options={options.types}
          selectedValues={filters.typeFilter}
          getColor={config.getTypeColor}
          getClassName={config.getTypeClassName}
          onToggle={(value) => onChange('typeFilter', value)}
        />
      </Col>

      <Col span={24}>
        <div className="song-page-filter-field">
          等级范围: {filters.levelRange[0]} - {filters.levelRange[1]}
        </div>
        <Slider
          range
          min={config.levelRange.min}
          max={config.levelRange.max}
          step={config.levelRange.step}
          value={filters.levelRange}
          onChange={(value) => onChange('levelRange', value)}
          tooltip={{ formatter: (value) => value?.toFixed(1) }}
        />
      </Col>
    </Row>

    <Divider />

    <strong>当前筛选条件</strong>
    <SongFilterTags tags={activeTags} onClear={onClear} />
  </Modal>
);

export default SongFilterModal;
