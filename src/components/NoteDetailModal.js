import React from 'react';
import { Modal, Table, Tag, Statistic, Row, Col } from 'antd';

const NoteDetailModal = ({ visible, onClose, sheet }) => {
  if (!sheet) return null;

  // 准备note数据
  const noteData = [];
  if (sheet.noteCounts) {
    const { tap, hold, slide, air, flick, total } = sheet.noteCounts;
    
    if (tap !== null && tap !== undefined) {
      noteData.push({
        key: 'tap',
        name: 'TAP',
        count: tap,
        percentage: sheet.notePercents?.tap || 0,
      });
    }
    
    if (hold !== null && hold !== undefined) {
      noteData.push({
        key: 'hold',
        name: 'HOLD',
        count: hold,
        percentage: sheet.notePercents?.hold || 0,
      });
    }
    
    if (slide !== null && slide !== undefined) {
      noteData.push({
        key: 'slide',
        name: 'SLIDE',
        count: slide,
        percentage: sheet.notePercents?.slide || 0,
      });
    }
    
    if (air !== null && air !== undefined) {
      noteData.push({
        key: 'air',
        name: 'AIR',
        count: air,
        percentage: sheet.notePercents?.air || 0,
      });
    }
    
    if (flick !== null && flick !== undefined) {
      noteData.push({
        key: 'flick',
        name: 'FLICK',
        count: flick,
        percentage: sheet.notePercents?.flick || 0,
      });
    }
    
    if (total !== null && total !== undefined) {
      noteData.push({
        key: 'total',
        name: '总计',
        count: total,
        percentage: 100,
      });
    }
  }

  const columns = [
    {
      title: '类型',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => `${percentage}%`,
    },
  ];

  return (
    <Modal
      title={`音符详情 - ${sheet.difficulty} (${sheet.level})`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic title="谱面类型" value={sheet.type === 'std' ? '标准' : 'DX'} />
        </Col>
        <Col span={8}>
          <Statistic title="难度" value={sheet.difficulty} />
        </Col>
        <Col span={8}>
          <Statistic title="等级" value={sheet.level} />
        </Col>
      </Row>
      
      {sheet.internalLevel && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Statistic title="内部等级" value={sheet.internalLevel} />
          </Col>
          <Col span={8}>
            <Statistic title="谱面设计师" value={sheet.noteDesigner || '-'} />
          </Col>
          <Col span={8}>
            <Statistic title="总音符数" value={sheet.noteCounts?.total || 0} />
          </Col>
        </Row>
      )}
      
      <Table
        dataSource={noteData}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default NoteDetailModal;