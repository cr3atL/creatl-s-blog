import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Input, 
  Select, 
  Slider, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col,
  Checkbox,
  Collapse
} from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Panel } = Collapse;

const MaimaiFilter = ({
  visible,
  filters,
  filterOptions,
  onClose,
  onApply,
  onReset,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  // 当filters或visible变化时，更新临时筛选条件
  useEffect(() => {
    if (visible) {
      setTempFilters(filters);
    }
  }, [filters, visible]);

  // 更新筛选条件
  const updateFilter = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 应用筛选条件
  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  // 重置筛选条件
  const handleReset = () => {
    onReset();
    onClose();
  };

  // 渲染筛选条件标签
  const renderFilterTags = () => {
    const tags = [];
    
    if (tempFilters.categories.length > 0) {
      tags.push(
        <Tag key="categories" closable onClose={() => updateFilter('categories', [])}>
          分类: {tempFilters.categories.join(', ')}
        </Tag>
      );
    }
    
    if (tempFilters.title) {
      tags.push(
        <Tag key="title" closable onClose={() => updateFilter('title', null)}>
          标题: {tempFilters.title}
        </Tag>
      );
    }
    
    if (tempFilters.artist) {
      tags.push(
        <Tag key="artist" closable onClose={() => updateFilter('artist', null)}>
          艺术家: {tempFilters.artist}
        </Tag>
      );
    }
    
    if (tempFilters.versions.length > 0) {
      tags.push(
        <Tag key="versions" closable onClose={() => updateFilter('versions', [])}>
          版本: {tempFilters.versions.join(', ')}
        </Tag>
      );
    }
    
    if (tempFilters.types.length > 0) {
      tags.push(
        <Tag key="types" closable onClose={() => updateFilter('types', [])}>
          类型: {tempFilters.types.join(', ')}
        </Tag>
      );
    }
    
    if (tempFilters.difficulties.length > 0) {
      tags.push(
        <Tag key="difficulties" closable onClose={() => updateFilter('difficulties', [])}>
          难度: {tempFilters.difficulties.join(', ')}
        </Tag>
      );
    }
    
    if (tempFilters.minLevelValue !== null || tempFilters.maxLevelValue !== null) {
      tags.push(
        <Tag 
          key="level" 
          closable 
          onClose={() => {
            updateFilter('minLevelValue', null);
            updateFilter('maxLevelValue', null);
          }}
        >
          等级: {tempFilters.minLevelValue || 0} - {tempFilters.maxLevelValue || '∞'}
        </Tag>
      );
    }
    
    if (tempFilters.region) {
      tags.push(
        <Tag key="region" closable onClose={() => updateFilter('region', null)}>
          地区: {tempFilters.region}
        </Tag>
      );
    }
    
    return tags;
  };

  return (
    <Modal
      title="筛选条件"
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="reset" icon={<ClearOutlined />} onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          应用
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          {renderFilterTags()}
        </Space>
      </div>
      
      <Collapse defaultActiveKey={['basic', 'advanced']}>
        <Panel header="基本筛选" key="basic">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>标题</div>
              <Input
                placeholder="输入标题"
                value={tempFilters.title || ''}
                onChange={e => updateFilter('title', e.target.value || null)}
              />
              <div style={{ marginTop: 4 }}>
                <Checkbox
                  checked={tempFilters.matchExactTitle || false}
                  onChange={e => updateFilter('matchExactTitle', e.target.checked)}
                >
                  精确匹配
                </Checkbox>
              </div>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>艺术家</div>
              <Input
                placeholder="输入艺术家"
                value={tempFilters.artist || ''}
                onChange={e => updateFilter('artist', e.target.value || null)}
              />
              <div style={{ marginTop: 4 }}>
                <Checkbox
                  checked={tempFilters.matchExactArtist || false}
                  onChange={e => updateFilter('matchExactArtist', e.target.checked)}
                >
                  精确匹配
                </Checkbox>
              </div>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>分类</div>
              <Select
                mode="multiple"
                placeholder="选择分类"
                style={{ width: '100%' }}
                value={tempFilters.categories}
                onChange={value => updateFilter('categories', value)}
              >
                {filterOptions.categories?.map(cat => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.text} ({cat.count})
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>版本</div>
              <Select
                mode="multiple"
                placeholder="选择版本"
                style={{ width: '100%' }}
                value={tempFilters.versions}
                onChange={value => updateFilter('versions', value)}
              >
                {filterOptions.versions?.map(ver => (
                  <Option key={ver.value} value={ver.value}>
                    {ver.text} ({ver.count})
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>类型</div>
              <Select
                mode="multiple"
                placeholder="选择类型"
                style={{ width: '100%' }}
                value={tempFilters.types}
                onChange={value => updateFilter('types', value)}
              >
                {filterOptions.types?.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.text} ({type.count})
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>难度</div>
              <Select
                mode="multiple"
                placeholder="选择难度"
                style={{ width: '100%' }}
                value={tempFilters.difficulties}
                onChange={value => updateFilter('difficulties', value)}
              >
                {filterOptions.difficulties?.map(diff => (
                  <Option key={diff.value} value={diff.value}>
                    {diff.text} ({diff.count})
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>地区</div>
              <Select
                placeholder="选择地区"
                style={{ width: '100%' }}
                value={tempFilters.region || undefined}
                onChange={value => updateFilter('region', value || null)}
                allowClear
              >
                {filterOptions.regions?.map(region => (
                  <Option key={region.value} value={region.value}>
                    {region.text} ({region.count})
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: 8 }}>谱面设计师</div>
              <Select
                mode="multiple"
                placeholder="选择谱面设计师"
                style={{ width: '100%' }}
                value={tempFilters.noteDesigners}
                onChange={value => updateFilter('noteDesigners', value)}
              >
                {filterOptions.noteDesigners?.map(designer => (
                  <Option key={designer.value} value={designer.value}>
                    {designer.text} ({designer.count})
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Panel>
        
        <Panel header="高级筛选" key="advanced">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ marginBottom: 8 }}>BPM范围</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  type="number"
                  placeholder="最小BPM"
                  value={tempFilters.minBPM || ''}
                  onChange={e => updateFilter('minBPM', e.target.value ? parseFloat(e.target.value) : null)}
                  style={{ width: '100px', marginRight: 8 }}
                />
                <span style={{ margin: '0 8px' }}>-</span>
                <Input
                  type="number"
                  placeholder="最大BPM"
                  value={tempFilters.maxBPM || ''}
                  onChange={e => updateFilter('maxBPM', e.target.value ? parseFloat(e.target.value) : null)}
                  style={{ width: '100px', marginRight: 8 }}
                />
              </div>
            </Col>
            
            <Col span={24}>
              <div style={{ marginBottom: 8 }}>等级范围</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                  range
                  min={0}
                  max={15}
                  step={0.1}
                  value={[
                    tempFilters.minLevelValue || 0,
                    tempFilters.maxLevelValue || 15,
                  ]}
                  onChange={value => {
                    updateFilter('minLevelValue', value[0]);
                    updateFilter('maxLevelValue', value[1]);
                  }}
                  style={{ flex: 1, marginRight: 16 }}
                />
                <div style={{ minWidth: '100px' }}>
                  {tempFilters.minLevelValue || 0} - {tempFilters.maxLevelValue || 15}
                </div>
              </div>
            </Col>
            
          </Row>
        </Panel>
      </Collapse>
    </Modal>
  );
};

export default MaimaiFilter;