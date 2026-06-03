import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Image,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { BulbOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import SongFilterModal, { SongFilterTags } from '../components/SongFilterModal';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { createChunithmSongFilterConfig } from '../config/songFilterConfigs';
import useSongFilters from '../hooks/useSongFilters';
import { pickItem } from '../utils/random';
import '../styles/song-pages.css';

const { Title, Paragraph } = Typography;

const dataSourceUrl = 'https://dp4p6x0xfi5o9.cloudfront.net/chunithm';

const difficultyColors = {
  BASIC: 'green',
  ADVANCED: 'orange',
  EXPERT: 'red',
  MASTER: 'purple',
  ULTIMA: 'black',
  basic: 'green',
  advanced: 'orange',
  expert: 'red',
  master: 'purple',
  ultima: 'black',
  "WORLD'S END": 'rainbow',
};

const versionColors = {
  CHUNITHM: 'yellow',
  'CHUNITHM PLUS': 'orange',
  AIR: 'blue',
  'AIR PLUS': 'cyan',
  STAR: '#FFD700',
  'STAR PLUS': '#FFA500',
  AMAZON: '#FF4500',
  'AMAZON PLUS': 'geekblue',
  CRYSTAL: 'orange',
  'CRYSTAL PLUS': 'red',
  PARADISE: 'volcano',
  'PARADISE LOST': '#8706DD',
  'CHUNITHM NEW': '#FF9900',
  'CHUNITHM NEW PLUS': '#FF6600',
  SUN: '#FFD700',
  'SUN PLUS': '#FFA500',
  LUMINOUS: 'pink',
  'LUMINOUS PLUS': '#FF00C8',
  VERSE: 'lime',
  'X-VERSE': '#00FFDD',
};

const typeColors = {
  ORIGINAL: 'red',
  VARIETY: 'orange',
  ANIME: 'pink',
  GAME: 'green',
  NICONICO: 'purple',
  TOUHOU: 'cyan',
  VOCALOID: 'blue',
  GEKIDAN: 'gold',
  'CHUNITHM ORIGINAL': 'magenta',
};

const getDifficultyColor = (difficulty) => difficultyColors[difficulty] || 'default';
const getVersionColor = (version) => versionColors[version] || 'default';
const getTypeColor = (type) => typeColors[type] || 'default';

const formatLevel = (sheet) => {
  if (typeof sheet.internalLevelValue === 'number') {
    return sheet.internalLevelValue.toFixed(1);
  }
  return sheet.level || sheet.levelValue || '-';
};

const ChunithmSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDetailModalVisible, setSongDetailModalVisible] = useState(false);
  const [selectedRandomSongs, setSelectedRandomSongs] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawnSong, setCurrentDrawnSong] = useState(null);
  const [drawAnimationVisible, setDrawAnimationVisible] = useState(false);

  const songFilterConfig = useMemo(
    () =>
      createChunithmSongFilterConfig({
        getDifficultyColor,
        getVersionColor,
        getTypeColor,
      }),
    []
  );

  const {
    tempFilters,
    options: filterOptions,
    filteredSongs,
    activeTags,
    tempActiveTags,
    filterModalVisible,
    openFilterModal,
    closeFilterModal,
    applyTempFilters,
    resetTempFilters,
    clearFilter,
    clearTempFilter,
    setTempFilter,
  } = useSongFilters(songs, songFilterConfig);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${dataSourceUrl}/data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const processedSongs = data.songs.map((song) => ({
          ...song,
          imageUrl: song.imageName ? `${dataSourceUrl}/img/cover/${song.imageName}` : null,
          type: song.category || '未知类型',
          sheets: (song.sheets || []).map((sheet) => ({
            ...sheet,
            imageUrl: sheet.imageName ? `${dataSourceUrl}/img/cover/${sheet.imageName}` : null,
          })),
        }));

        setSongs(processedSongs);
        setError(null);
      } catch (err) {
        setError(`获取 CHUNITHM 曲库数据失败: ${err.message}`);
        console.error('Error fetching CHUNITHM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const openSongDetail = useCallback((song) => {
    setSelectedSong(song);
    setSongDetailModalVisible(true);
  }, []);

  const pickRandomSong = useCallback(() => {
    if (filteredSongs.length === 0) {
      message.warning('没有符合条件的歌曲可以随机选择');
      return;
    }

    if (isDrawing) {
      return;
    }

    setIsDrawing(true);
    setDrawAnimationVisible(true);

    let animationCount = 0;
    const animationTimer = setInterval(() => {
      setCurrentDrawnSong(pickItem(filteredSongs));
      animationCount += 1;

      if (animationCount >= 20) {
        clearInterval(animationTimer);
        const finalSong = pickItem(filteredSongs);
        setCurrentDrawnSong(finalSong);

        setTimeout(() => {
          if (selectedRandomSongs.some((song) => song.songId === finalSong.songId)) {
            message.warning('这首歌曲已经在随机选择列表中了');
          } else {
            setSelectedRandomSongs((prev) => [...prev, finalSong]);
            message.success(`已随机选择: ${finalSong.title}`);
            openSongDetail(finalSong);
          }
          setIsDrawing(false);
          setDrawAnimationVisible(false);
        }, 800);
      }
    }, 100);
  }, [filteredSongs, isDrawing, openSongDetail, selectedRandomSongs]);

  const clearRandomSongs = useCallback(() => {
    setSelectedRandomSongs([]);
    message.info('已清空随机选曲列表');
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '封面',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render: (imageUrl, record) =>
          imageUrl ? (
            <Image
              src={imageUrl}
              alt={record.title}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          ) : null,
      },
      {
        title: '曲目',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ color: '#666', fontSize: 12 }}>{record.artist}</div>
          </div>
        ),
      },
      {
        title: '难度',
        dataIndex: 'sheets',
        key: 'difficulty',
        render: (sheets = []) => (
          <Space wrap>
            {sheets.map((sheet, index) => (
              <Tag
                key={`${sheet.difficulty}-${index}`}
                color={sheet.difficulty === "WORLD'S END" ? 'default' : getDifficultyColor(sheet.difficulty)}
                className={sheet.difficulty === "WORLD'S END" ? 'ant-tag-rainbow' : ''}
              >
                {sheet.difficulty} {sheet.level}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
        render: (version) => <Tag color={getVersionColor(version)}>{version || '未知版本'}</Tag>,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (type) => (
          <Tag
            color={type === "WORLD'S END" ? 'default' : getTypeColor(type)}
            className={type === "WORLD'S END" ? 'ant-tag-rainbow' : ''}
          >
            {type || '未知类型'}
          </Tag>
        ),
      },
    ],
    []
  );

  return (
    <ResponsiveLayout>
      <div className="song-page-shell">
        <Title level={2}>CHUNITHM 曲库</Title>
        <Paragraph>CHUNITHM 曲库数据，包括歌曲的难度、版本和类型信息。</Paragraph>

        {error && <Alert message="错误" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
            <div style={{ marginTop: 20 }}>正在加载 CHUNITHM 曲库数据...</div>
          </div>
        ) : (
          <>
            <SongFilterModal
              open={filterModalVisible}
              filters={tempFilters}
              options={filterOptions}
              activeTags={tempActiveTags}
              config={songFilterConfig}
              onCancel={closeFilterModal}
              onApply={applyTempFilters}
              onReset={resetTempFilters}
              onChange={setTempFilter}
              onClear={clearTempFilter}
            />

            <Card style={{ marginBottom: 20 }}>
              <Space wrap>
                <Button type="primary" icon={<FilterOutlined />} onClick={openFilterModal}>
                  筛选条件
                </Button>
                <Button icon={<BulbOutlined />} onClick={pickRandomSong} disabled={isDrawing} loading={isDrawing}>
                  {isDrawing ? '抽取中...' : '随机选曲'}
                </Button>
                {selectedRandomSongs.length > 0 && (
                  <Button icon={<CloseOutlined />} onClick={clearRandomSongs}>
                    清空随机
                  </Button>
                )}
              </Space>

              <SongFilterTags tags={activeTags} onClear={clearFilter} />

              {selectedRandomSongs.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <strong>随机选曲列表 ({selectedRandomSongs.length})</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 12 }}>
                    {selectedRandomSongs.map((song) => (
                      <Card key={song.songId} size="small" hoverable onClick={() => openSongDetail(song)}>
                        <Space align="start">
                          {song.imageUrl && <Image src={song.imageUrl} alt={song.title} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 4 }} />}
                          <div>
                            <div style={{ fontWeight: 600 }}>{song.title}</div>
                            <div style={{ color: '#666', fontSize: 12 }}>{song.artist}</div>
                            <Tag color="orange" style={{ marginTop: 6 }}>{song.sheets?.length || 0} 谱面</Tag>
                          </div>
                        </Space>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <Table
                columns={columns}
                dataSource={filteredSongs}
                rowKey="songId"
                onRow={(record) => ({ onClick: () => openSongDetail(record) })}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
                scroll={{ x: 'max-content' }}
              />
            </Card>

            <Paragraph type="secondary" style={{ marginTop: 20, textAlign: 'center' }}>
              总计: {songs.length} 首歌曲 | 当前显示: {filteredSongs.length} 首歌曲
            </Paragraph>
          </>
        )}
      </div>

      <Modal title="随机抽取中..." open={drawAnimationVisible} closable={false} footer={null} width="min(700px, calc(100vw - 32px))" centered>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={3}>歌曲抽取中...</Title>
          {currentDrawnSong && (
            <Card>
              <Title level={4}>{currentDrawnSong.title}</Title>
              <Paragraph>{currentDrawnSong.artist}</Paragraph>
              {!isDrawing && currentDrawnSong.imageUrl && <Image src={currentDrawnSong.imageUrl} alt={currentDrawnSong.title} width={220} />}
            </Card>
          )}
        </div>
      </Modal>

      <Modal
        title="歌曲详情"
        open={songDetailModalVisible}
        onCancel={() => setSongDetailModalVisible(false)}
        footer={[<Button key="close" onClick={() => setSongDetailModalVisible(false)}>关闭</Button>]}
        width="min(800px, calc(100vw - 32px))"
        centered
      >
        {selectedSong && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              {selectedSong.imageUrl ? (
                <Image src={selectedSong.imageUrl} alt={selectedSong.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
              ) : (
                <div style={{ width: 200, height: 200, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  暂无封面
                </div>
              )}
            </Col>
            <Col xs={24} md={16}>
              <Title level={3}>{selectedSong.title}</Title>
              <Paragraph>{selectedSong.artist || '未知曲师'}</Paragraph>
              <Space wrap>
                <Tag color={getVersionColor(selectedSong.version)}>{selectedSong.version || '未知版本'}</Tag>
                <Tag color={getTypeColor(selectedSong.type)}>{selectedSong.type || '未知类型'}</Tag>
                {selectedSong.bpm && <Tag color="blue">BPM: {selectedSong.bpm}</Tag>}
              </Space>
              <Divider />
              <Title level={4}>谱面信息</Title>
              <Row gutter={[12, 12]}>
                {(selectedSong.sheets || []).map((sheet, index) => (
                  <Col xs={24} sm={12} key={`${sheet.difficulty}-${index}`}>
                    <Card size="small">
                      <Tag
                        color={sheet.difficulty === "WORLD'S END" ? 'default' : getDifficultyColor(sheet.difficulty)}
                        className={sheet.difficulty === "WORLD'S END" ? 'ant-tag-rainbow' : ''}
                      >
                        {sheet.difficulty}
                      </Tag>
                      <strong style={{ marginLeft: 8 }}>Level {formatLevel(sheet)}</strong>
                      {sheet.notes && <div style={{ marginTop: 8, color: '#666' }}>总音符数: {sheet.notes}</div>}
                      {sheet.charter && <div style={{ color: '#666' }}>谱师: {sheet.charter}</div>}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Modal>
    </ResponsiveLayout>
  );
};

export default ChunithmSongs;
