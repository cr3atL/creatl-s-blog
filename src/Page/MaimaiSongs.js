import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Spin, 
  message, 
  Typography, 
  Space, 
  Button, 
  Row, 
  Col, 
  Divider, 
  Statistic, 
  Empty, 
  Modal, 
  Input
} from 'antd';
import {  
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined, 
  PlayCircleOutlined, 
  SwapOutlined 
} from '@ant-design/icons';
import ResponsiveLayout from '../components/ResponsiveLayout';
import MaimaiFilter from '../components/MaimaiFilter';
import SafeImage from '../components/SafeImage';
import NoteDetailModal from '../components/NoteDetailModal';
import { preprocessData } from '../utils/maimaiData.js';
import { 
  createDefaultFilters, 
  parseFiltersFromURL, 
  filtersToURLParams, 
  applyFilters, 
  createFilterOptions, 
  countActiveFilters 
} from '../utils/maimaiFilters.js';


const { Title, Paragraph } = Typography;
const { Search } = Input;

const MaimaiSongs = () => {
  // 状态管理
  const [data, setData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(createDefaultFilters());
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDetailModalVisible, setSongDetailModalVisible] = useState(false);
  const [selectedRandomSongs, setSelectedRandomSongs] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [noteDetailModalVisible, setNoteDetailModalVisible] = useState(false);
  
  // 筛选弹窗状态
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // 数据源URL
  const dataSourceUrl = 'https://dp4p6x0xfi5o9.cloudfront.net/maimai';

  // 获取歌曲数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${dataSourceUrl}/data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const rawData = await response.json();
        
        // 预处理数据
        const processedData = preprocessData(rawData);
        const options = createFilterOptions(processedData);
        
        setData(processedData);
        setFilterOptions(options);
        setError(null);
      } catch (err) {
        setError('获取 maimai 曲库数据失败: ' + err.message);
        console.error('Error fetching maimai data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 从URL参数初始化筛选条件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlFilters = parseFiltersFromURL(urlParams);
      setFilters(urlFilters);
    }
  }, []);

  // 更新URL参数
  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      const urlParams = filtersToURLParams(filters);
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [filters, data]);

  // 使用useMemo缓存颜色映射对象，避免重复创建
  const difficultyColors = useMemo(() => ({
    'basic': '#22bb5b',
    'advanced': '#fb9c2d',
    'expert': '#f64861',
    'master': '#9e45e2',
    'remaster': '#ba67f8',
  }), []);
  
  const versionColors = useMemo(() => ({}), []);
  
  const typeColors = useMemo(() => ({
    '宴会場': '#9D4EDD',
  }), []);

  // 使用useCallback缓存颜色获取函数
  const getDifficultyColor = useCallback((difficulty) => {
    return difficultyColors[difficulty] || 'default';
  }, [difficultyColors]);
  
  const getVersionColor = useCallback((version) => {
    return versionColors[version] || 'default';
  }, [versionColors]);
  
  const getTypeColor = useCallback((type) => {
    return typeColors[type] || 'default';
  }, [typeColors]);

  // 根据谱面type字段判断难度类型
  const getDifficultyType = useCallback((sheet) => {
    if (sheet.type === 'std') {
      return '标准';
    } else if (sheet.type === 'dx') {
      return 'DX';
    }
    return '未知';
  }, []);

  // 筛选歌曲
  const filteredSongs = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.songs, filters);
  }, [data, filters]);

  // 随机选曲
  const drawRandomSong = useCallback(() => {
    if (filteredSongs.length === 0) {
      message.warning('没有符合条件的歌曲可供随机选择');
      return;
    }
    
    // 如果已经在抽奖中，则停止
    if (isDrawing) {
      setIsDrawing(false);
      if (animationInterval) {
        clearInterval(animationInterval);
        setAnimationInterval(null);
      }
      return;
    }
    
    setIsDrawing(true);
    
    // 创建动画效果
    const interval = setInterval(() => {
      const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
      setSelectedRandomSongs([randomSong]);
    }, 100);
    
    setAnimationInterval(interval);
    
    // 3秒后停止动画并确定最终结果
    setTimeout(() => {
      clearInterval(interval);
      setAnimationInterval(null);
      setIsDrawing(false);
      
      // 最终随机选择
      const finalSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
      setSelectedRandomSongs([finalSong]);
      
      message.success(`已随机选择: ${finalSong.title}`);
    }, 3000);
  }, [filteredSongs, isDrawing, animationInterval]);

  // 处理筛选条件变化
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // 重置筛选条件
  const handleResetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  // 获取活跃筛选条件数量
  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  // 渲染歌曲详情
  const renderSongDetail = useCallback((song) => {
    if (!song) return null;
    
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={8}>
              <SafeImage
                src={song.imageUrl}
                alt={song.title}
                style={{ width: '100%' }}
              />
            </Col>
          <Col span={16}>
            <Title level={3}>{song.title}</Title>
            <Paragraph>{song.artist}</Paragraph>
            <div>
              <Tag color={getVersionColor(song.version)}>{song.version}</Tag>
              <Tag color={getTypeColor(song.type)}>{song.type}</Tag>
              <Tag color="blue">BPM: {song.bpm}</Tag>
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <Table
          dataSource={song.sheets}
          pagination={false}
          size="small"
          rowKey="sheetExpr"
          columns={[
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type',
              render: (type) => getDifficultyType({ type }),
            },
            {
              title: '难度',
              dataIndex: 'difficulty',
              key: 'difficulty',
              render: (difficulty) => (
                <Tag color={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Tag>
              ),
            },
            {
              title: '等级',
              dataIndex: 'levelValue',
              key: 'levelValue',
              render: (level, record) => (
                <span>
                  {level}
                  {record.internalLevelValue && (
                    <span style={{ marginLeft: 4, color: '#999' }}>
                      ({record.internalLevelValue})
                    </span>
                  )}
                </span>
              ),
            },
            {
              title: '谱面设计师',
              dataIndex: 'noteDesigner',
              key: 'noteDesigner',
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button
                  type="link"
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    setSelectedSheet(record);
                    setNoteDetailModalVisible(true);
                  }}
                >
                  查看音符
                </Button>
              ),
            },
          ]}
        />
      </div>
    );
  }, [getDifficultyColor, getVersionColor, getTypeColor, getDifficultyType]);

  // 渲染歌曲列表
  const columns = [
    {
      title: '序号',
      dataIndex: 'songNo',
      key: 'songNo',
      width: 60,
    },
    {
      title: '封面',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url) => (
          <SafeImage
            src={url}
            alt="封面"
            style={{ width: 40, height: 40 }}
          />
        ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedSong(record);
            setSongDetailModalVisible(true);
          }}
        >
          {title}
        </Button>
      ),
    },
    {
      title: '艺术家',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version) => (
        <Tag color={getVersionColor(version)}>
          {version}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'BPM',
      dataIndex: 'bpm',
      key: 'bpm',
      width: 80,
    },
    {
      title: '难度',
      key: 'difficulties',
      render: (_, record) => (
        <Space wrap>
          {record.sheets?.map(sheet => (
            <Tag
              key={sheet.sheetExpr}
              color={getDifficultyColor(sheet.difficulty)}
            >
              {sheet.difficulty} {sheet.levelValue}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <ResponsiveLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>加载中...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>加载失败</Title>
          <Paragraph>{error}</Paragraph>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div style={{ padding: '0 16px' }}>
        <Title level={2}>maimai 曲库</Title>
        
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Search
                placeholder="搜索歌曲标题或艺术家"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ width: 300 }}
                onSearch={(value) => {
                  handleFilterChange({
                    ...filters,
                    title: value || null,
                  });
                }}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setFilterModalVisible(true)}
              >
                筛选 {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ClearOutlined />}
                onClick={handleResetFilters}
                disabled={activeFiltersCount === 0}
              >
                重置
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={drawRandomSong}
                disabled={filteredSongs.length === 0}
              >
                {isDrawing ? '停止抽奖' : '随机选曲'}
              </Button>
            </Col>
          </Row>
        </div>
        
        {selectedRandomSongs.length > 0 && (
          <Card
            title="随机选择结果"
            style={{ marginBottom: 16 }}
            extra={
              <Button
                size="small"
                onClick={() => setSelectedRandomSongs([])}
              >
                清除
              </Button>
            }
          >
            {selectedRandomSongs.map(song => (
              <div key={song.songId} style={{ marginBottom: 8 }}>
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedSong(song);
                    setSongDetailModalVisible(true);
                  }}
                >
                  {song.title} - {song.artist}
                </Button>
              </div>
            ))}
          </Card>
        )}
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Statistic
              title="总歌曲数"
              value={data?.songs?.length || 0}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="筛选结果"
              value={filteredSongs.length}
              suffix={`/ ${data?.songs?.length || 0}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活跃筛选"
              value={activeFiltersCount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="更新时间"
              value={data?.updateTime || '未知'}
            />
          </Col>
        </Row>
        
        {filteredSongs.length === 0 ? (
          <Empty description="没有符合条件的歌曲" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredSongs}
            rowKey="songId"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        )}
      </div>
      
      <MaimaiFilter
        visible={filterModalVisible}
        filters={filters}
        filterOptions={filterOptions}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterChange}
        onReset={handleResetFilters}
      />
      
      <Modal
        title="歌曲详情"
        visible={songDetailModalVisible}
        onCancel={() => setSongDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {renderSongDetail(selectedSong)}
      </Modal>

      <NoteDetailModal
        visible={noteDetailModalVisible}
        onClose={() => setNoteDetailModalVisible(false)}
        sheet={selectedSheet}
      />
    </ResponsiveLayout>
  );
};

export default MaimaiSongs;