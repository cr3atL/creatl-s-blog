import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Typography, 
  Card, 
  Table, 
  Tag, 
  Spin, 
  Alert, 
  Input, 
  Space,
  Image,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Slider,
  message
} from 'antd';
import { SearchOutlined, FilterOutlined, BulbOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { pickItem } from '../utils/random';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const ChunithmSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 实际筛选状态（用于显示筛选结果）
  const [searchText, setSearchText] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [versionFilter, setVersionFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [levelRange, setLevelRange] = useState([1, 15.7]);
  
  // 临时筛选状态（用于弹窗内的预览）
  const [tempSearchText, setTempSearchText] = useState('');
  const [tempDifficultyFilter, setTempDifficultyFilter] = useState([]);
  const [tempVersionFilter, setTempVersionFilter] = useState([]);
  const [tempTypeFilter, setTempTypeFilter] = useState([]);
  const [tempLevelRange, setTempLevelRange] = useState([1, 15.7]);
  
  // 添加弹窗状态
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // 添加歌曲详情弹窗状态
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDetailModalVisible, setSongDetailModalVisible] = useState(false);
  
  // 随机选曲相关状态
  const [selectedRandomSongs, setSelectedRandomSongs] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawnSong, setCurrentDrawnSong] = useState(null);
  const [drawAnimationVisible, setDrawAnimationVisible] = useState(false);
  
  // 处理等级范围变化（滑块释放时才触发筛选）
  const handleLevelRangeChange = useCallback((value) => {
    setTempLevelRange(value);
  }, []);
  
  // 滑块释放时触发筛选
  const handleLevelRangeChangeComplete = useCallback((value) => {
    setTempLevelRange(value);
  }, []);
  
  // 使用useMemo缓存计算结果，避免重复计算
  const difficulties = useMemo(() => [...new Set(songs.flatMap(song => song.sheets.map(sheet => sheet.difficulty)))].filter(Boolean), [songs]);
  const versions = useMemo(() => [...new Set(songs.map(song => song.version))].filter(Boolean), [songs]);
  const types = useMemo(() => [...new Set(songs.map(song => song.type))].filter(Boolean), [songs]);
  
  // 使用useMemo缓存筛选结果，避免重复计算
  const filteredSongs = useMemo(() => {
    let result = songs;
    
    // 按标题搜索
    if (searchText) {
      result = result.filter(song => 
        song.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 按版本过滤
    if (versionFilter.length > 0) {
      result = result.filter(song => versionFilter.includes(song.version));
    }
    
    // 按类型过滤
    if (typeFilter.length > 0) {
      result = result.filter(song => typeFilter.includes(song.type));
    }
    
    // 处理难度和等级范围过滤
    result = result.map(song => {
      let filteredSheets = song.sheets;
      
      // 按难度过滤 - 如果选择了难度，只显示选中的难度
      if (difficultyFilter.length > 0) {
        filteredSheets = filteredSheets.filter(sheet => difficultyFilter.includes(sheet.difficulty));
      }
      
      // 按等级范围过滤
      if (levelRange[0] > 1 || levelRange[1] < 15.7) {
        const minLevel = levelRange[0];
        const maxLevel = levelRange[1];
        filteredSheets = filteredSheets.filter(sheet => {
          const level = sheet.internalLevelValue || sheet.levelValue || parseFloat(sheet.level);
          return !isNaN(level) && level >= minLevel && level <= maxLevel;
        });
      }
      
      return {
        ...song,
        sheets: filteredSheets
      };
    }).filter(song => song.sheets.length > 0); // 过滤掉没有符合条件的sheets的歌曲
    
    return result;
  }, [songs, searchText, difficultyFilter, versionFilter, typeFilter, levelRange]);
  
  // 打开筛选弹窗时，将当前筛选状态复制到临时状态
  const openFilterModal = useCallback(() => {
    setTempSearchText(searchText);
    setTempDifficultyFilter([...difficultyFilter]);
    setTempVersionFilter([...versionFilter]);
    setTempTypeFilter([...typeFilter]);
    setTempLevelRange([...levelRange]);
    setFilterModalVisible(true);
  }, [searchText, difficultyFilter, versionFilter, typeFilter, levelRange]);
  
  // 应用筛选条件（点击确定按钮时）
  const applyFilters = useCallback(() => {
    setSearchText(tempSearchText);
    setDifficultyFilter([...tempDifficultyFilter]);
    setVersionFilter([...tempVersionFilter]);
    setTypeFilter([...tempTypeFilter]);
    setLevelRange([...tempLevelRange]);
    setFilterModalVisible(false);
  }, [tempSearchText, tempDifficultyFilter, tempVersionFilter, tempTypeFilter, tempLevelRange]);
  
  // 重置筛选条件（点击重置按钮时）
  const resetFilters = useCallback(() => {
    setTempSearchText('');
    setTempDifficultyFilter([]);
    setTempVersionFilter([]);
    setTempTypeFilter([]);
    setTempLevelRange([1, 15.7]);
  }, []);
  
  // 处理歌曲点击，显示详情弹窗
  const handleSongClick = useCallback((record) => {
    setSelectedSong(record);
    setSongDetailModalVisible(true);
  }, []);
  
  // 随机选曲函数
  const pickRandomSong = useCallback(() => {
    if (filteredSongs.length === 0) {
      message.warning('没有符合条件的歌曲可以随机选择');
      return;
    }
    
    if (isDrawing) {
      return; // 防止重复点击
    }
    
    setIsDrawing(true);
    setDrawAnimationVisible(true);
    
    // 快速切换歌曲的动画效果
    let animationCount = 0;
    const maxAnimations = 20; // 动画次数
    const animationInterval = 100; // 每次切换的时间间隔
    
    const animationTimer = setInterval(() => {
      const randomSong = pickItem(filteredSongs);
      setCurrentDrawnSong(randomSong);
      animationCount++;
      
      if (animationCount >= maxAnimations) {
        clearInterval(animationTimer);
        
        // 最终选择一首歌曲
        const finalSong = pickItem(filteredSongs);
        setCurrentDrawnSong(finalSong);
        
        // 检查是否已经选择过这首歌曲
        if (selectedRandomSongs.some(song => song.songId === finalSong.songId)) {
          setTimeout(() => {
            setIsDrawing(false);
            setDrawAnimationVisible(false);
            message.warning('这首歌曲已经在随机选择列表中了');
          }, 1000);
        } else {
          // 添加到选曲列表
          setTimeout(() => {
            setSelectedRandomSongs(prev => [...prev, finalSong]);
            setIsDrawing(false);
            setDrawAnimationVisible(false);
            message.success(`已随机选择: ${finalSong.title}`);
            
            // 自动显示歌曲详情弹窗
            setSelectedSong(finalSong);
            setSongDetailModalVisible(true);
          }, 1000);
        }
      }
    }, animationInterval);
  }, [filteredSongs, selectedRandomSongs, isDrawing]);
  
  // 清空随机选曲列表
  const clearRandomSongs = useCallback(() => {
    setSelectedRandomSongs([]);
    message.info('已清空随机选曲列表');
  }, []);
  
  // 移除单个随机选曲
  const removeRandomSong = useCallback((songId) => {
    setSelectedRandomSongs(prev => prev.filter(song => song.songId !== songId));
    message.info('已移除随机选择的歌曲');
  }, []);
  
  // 数据源URL
  const dataSourceUrl = 'https://dp4p6x0xfi5o9.cloudfront.net/chunithm';

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${dataSourceUrl}/data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // 处理数据，添加图片URL
        const processedSongs = data.songs.map(song => ({
          ...song,
          imageUrl: song.imageName ? `${dataSourceUrl}/img/cover/${song.imageName}` : null,
          type: song.category || "未知类型",
          sheets: song.sheets.map(sheet => ({
            ...sheet,
            imageUrl: sheet.imageName ? `${dataSourceUrl}/img/cover/${sheet.imageName}` : null
          }))
        }));
        
        setSongs(processedSongs);
        setError(null);
      } catch (err) {
        setError('获取 CHUNITHM 曲库数据失败: ' + err.message);
        console.error('Error fetching CHUNITHM data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);



  // 使用useMemo缓存颜色映射对象，避免重复创建
  const difficultyColors = useMemo(() => ({
    'basic': 'green',
    'advanced': 'orange',
    'expert': 'red',
    'master': 'purple',
    'ultima': 'black',
    'WORLD\'S END': 'rainbow',
  }), []);
  
  const versionColors = useMemo(() => ({
    'CHUNITHM': 'yellow',
    'CHUNITHM PLUS': 'orange',
    'AIR': 'blue',
    'AIR PLUS': 'skyblue',
    'STAR': '#FFD700',
    'STAR PLUS': '#FFA500',
    'AMAZON': '#FF4500',
    'AMAZON PLUS': 'geekblue',
    'CRYSTAL': 'orange',
    'CRYSTAL PLUS': 'red',
    'PARADISE': 'volcano',
    'PARADISE LOST': '#8706DDFF',
    'CHUNITHM NEW': '#FF9900FF',
    'CHUNITHM NEW PLUS': '#FF6600FF',
    'SUN': '#FFD700',
    'SUN PLUS': '#FFA500',
    'LUMINOUS': 'pink',
    'LUMINOUS PLUS': '#FF00C8FF',
    'VERSE': 'lime',
    'X-VERSE': '#00FFDDFF',
  }), []);
  
  const typeColors = useMemo(() => ({
    'ORIGINAL': 'red',
    'VARIETY': 'orange',
    'ANIME': 'pink',
    'GAME': 'green',
    'NICONICO': 'purple',
    'TOUHOU': 'cyan',
    'VOCALOID': 'blue',
    'GEKIDAN': 'gold',
    'CHUNITHM ORIGINAL': 'magenta',
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



  // 表格列定义
  const columns = [
    {
      title: '封面',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        imageUrl ? (
          <Image
            src={imageUrl}
            alt="封面"
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrKL1AoO8WgLl0AAAAASUVORK5CYII="
          />
        ) : null
      ),
      width: 80,
    },
    {
      title: '曲目',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '10px' }}>{text}</div>
          <div style={{ 
            fontSize: '12px', 
            width: '200px', 
            color: '#666',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{record.artist}</div>
        </div>
      ),
    },
    {
      title: '难度',
      dataIndex: 'sheets',
      key: 'difficulty',
      render: (sheets) => (
        <Space>
          {sheets.map((sheet, index) => (
            <Tag 
              key={index} 
              color={getDifficultyColor(sheet.difficulty)}
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
      render: (version) => {
        if (!version || version === 'null' || version === 'undefined') {
          return <Tag color="default">未知版本</Tag>;
        }
        return <Tag color={getVersionColor(version)}>{version}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        if (!type || type === 'null' || type === 'undefined') {
          return <Tag color="default">未知类型</Tag>;
        }
        return <Tag color={getTypeColor(type)}>{type}</Tag>;
      },
    },
  ];

  return (
    <ResponsiveLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <Title level={2}>CHUNITHM大调查</Title>
        <Paragraph>
          我做了个求你字母的曲库数据，包括歌曲的难度、版本和类型信息。
        </Paragraph>

        {error && (
          <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>正在加载 CHUNITHM 曲库数据...</div>
          </div>
        ) : (
          <>
            {/* 筛选弹窗组件 */}
            <Modal
              title="筛选条件"
              open={filterModalVisible}
              onCancel={() => setFilterModalVisible(false)}
              footer={[
                <Button key="reset" onClick={resetFilters}>
                  重置
                </Button>,
                <Button key="cancel" onClick={() => setFilterModalVisible(false)}>
                  取消
                </Button>,
                <Button key="ok" type="primary" onClick={applyFilters}>
                  确定
                </Button>,
              ]}
              width={600}
            >
              <div style={{ marginBottom: '16px' }}>
                <Search
                  placeholder="搜索歌曲或艺术家"
                  allowClear
                  enterButton={<SearchOutlined />}
                  value={tempSearchText}
                  onChange={(e) => setTempSearchText(e.target.value)}
                  onSearch={setTempSearchText}
                  style={{ marginBottom: '16px' }}
                />
              </div>
              
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>难度</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {difficulties.map(difficulty => (
                      <Tag
                        key={difficulty}
                        color={getDifficultyColor(difficulty)}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (tempDifficultyFilter.includes(difficulty)) {
                            setTempDifficultyFilter(tempDifficultyFilter.filter(d => d !== difficulty));
                          } else {
                            setTempDifficultyFilter([...tempDifficultyFilter, difficulty]);
                          }
                        }}
                      >
                        {tempDifficultyFilter.includes(difficulty) ? '✓ ' : ''}{difficulty}
                      </Tag>
                    ))}
                  </div>
                </Col>
                
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>版本</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {versions.map(version => (
                      <Tag
                        key={version}
                        color={getVersionColor(version)}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (tempVersionFilter.includes(version)) {
                            setTempVersionFilter(tempVersionFilter.filter(v => v !== version));
                          } else {
                            setTempVersionFilter([...tempVersionFilter, version]);
                          }
                        }}
                      >
                        {tempVersionFilter.includes(version) ? '✓ ' : ''}{version}
                      </Tag>
                    ))}
                  </div>
                </Col>
                
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>类型</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {types.map(type => (
                      <Tag
                        key={type}
                        color={getTypeColor(type)}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (tempTypeFilter.includes(type)) {
                            setTempTypeFilter(tempTypeFilter.filter(t => t !== type));
                          } else {
                            setTempTypeFilter([...tempTypeFilter, type]);
                          }
                        }}
                      >
                        {tempTypeFilter.includes(type) ? '✓ ' : ''}{type}
                      </Tag>
                    ))}
                  </div>
                </Col>
                
                <Col span={24}>
                  <div style={{ marginBottom: '8px' }}>等级范围: {tempLevelRange[0]} - {tempLevelRange[1]}</div>
                  <Slider
                    range
                    min={1}
                    max={15.7}
                    step={0.1}
                    value={tempLevelRange}
                    onChange={handleLevelRangeChange}
                    onAfterChange={handleLevelRangeChangeComplete}
                    tooltip={{ formatter: (value) => value?.toFixed(1) }}
                  />
                </Col>
              </Row>
              
              <Divider />
              
              <div>
                <strong>当前筛选条件:</strong>
                <div style={{ marginTop: '8px' }}>
                  {tempSearchText && (
                    <Tag color="blue" closable={() => setTempSearchText('')}>
                      搜索: {tempSearchText}
                    </Tag>
                  )}
                  {tempDifficultyFilter.length > 0 && (
                    <Tag color={getDifficultyColor(tempDifficultyFilter[0])} closable={() => setTempDifficultyFilter([])}>
                      难度: {tempDifficultyFilter.join(', ')}
                    </Tag>
                  )}
                  {tempVersionFilter.length > 0 && (
                    <Tag color={getVersionColor(tempVersionFilter[0])} closable={() => setTempVersionFilter([])}>
                      版本: {tempVersionFilter.join(', ')}
                    </Tag>
                  )}
                  {tempTypeFilter.length > 0 && (
                    <Tag color={getTypeColor(tempTypeFilter[0])} closable={() => setTempTypeFilter([])}>
                      类型: {tempTypeFilter.join(', ')}
                    </Tag>
                  )}
                  <Tag color="purple" closable={() => setTempLevelRange([1, 15.7])}>
                    等级: {tempLevelRange[0]} - {tempLevelRange[1]}
                  </Tag>
                </div>
              </div>
            </Modal>
            
            <Card style={{ marginBottom: '20px' }}>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={openFilterModal}
                size="large"
                style={{ marginRight: '10px' }}
              >
                筛选条件
              </Button>
              
              <Button 
                type="default" 
                icon={<BulbOutlined />}
                onClick={pickRandomSong}
                size="large"
                style={{ marginRight: '10px' }}
              >
                随机选曲
              </Button>
              
              {selectedRandomSongs.length > 0 && (
                <Button 
                  type="default" 
                  icon={<CloseOutlined />}
                  onClick={clearRandomSongs}
                  size="large"
                >
                  清空随机
                </Button>
              )}
              
              {/* 随机选曲列表 */}
              {selectedRandomSongs.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '20px' }}>
                    随机选曲列表 ({selectedRandomSongs.length})
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '10px',
                  }}>
                    {selectedRandomSongs.map((song, index) => (
                      <div
                        key={`${song.songId}-${index}`}
                        onClick={() => {
                          setSelectedSong(song);
                          setSongDetailModalVisible(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '2px solid #ffd700',
                          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.15)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                          {song.imageUrl && (
                            <Image
                              src={song.imageUrl}
                              alt={song.title}
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '2px solid #ffd700',
                                marginRight: '15px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              }}
                              preview={false}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: 0, 
                              color: '#333', 
                              fontSize: '16px', 
                              fontWeight: 'bold',
                              lineHeight: '1.2'
                            }}>
                              {song.title}
                            </h4>
                            <p style={{ 
                              margin: '5px 0 0 0', 
                              color: '#666', 
                              fontSize: '14px' 
                            }}>
                              {song.artist}
                            </p>
                          </div>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRandomSongs(prev => 
                                prev.filter(s => s.songId !== song.songId)
                              );
                              message.success(`已移除: ${song.title}`);
                            }}
                            style={{
                              border: 'none',
                              background: 'rgba(255, 77, 79, 0.1)',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {song.difficulty && (
                            <Tag 
                              color={difficultyColors[song.difficulty] || 'default'}
                              style={{ fontSize: '12px', padding: '2px 6px' }}
                            >
                              {song.difficulty}
                            </Tag>
                          )}
                          {song.version && (
                            <Tag 
                              color={versionColors[song.version] || 'default'}
                              style={{ fontSize: '12px', padding: '2px 6px' }}
                            >
                              {song.version}
                            </Tag>
                          )}
                          {song.type && (
                            <Tag 
                              color={typeColors[song.type] || 'default'}
                              style={{ fontSize: '12px', padding: '2px 6px' }}
                            >
                              {song.type}
                            </Tag>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 显示当前筛选条件的标签 */}
              <div style={{ marginTop: '16px' }}>
                {searchText && (
                  <Tag color="blue" closable onClose={() => setSearchText('')}>
                    搜索: {searchText}
                  </Tag>
                )}
                {difficultyFilter.length > 0 && (
                  <Tag color={getDifficultyColor(difficultyFilter[0])} closable onClose={() => setDifficultyFilter([])}>
                    难度: {difficultyFilter.join(', ')}
                  </Tag>
                )}
                {versionFilter.length > 0 && (
                  <Tag color={getVersionColor(versionFilter[0])} closable onClose={() => setVersionFilter([])}>
                    版本: {versionFilter.join(', ')}
                  </Tag>
                )}
                {typeFilter.length > 0 && (
                  <Tag color={getTypeColor(typeFilter[0])} closable onClose={() => setTypeFilter([])}>
                    类型: {typeFilter.join(', ')}
                  </Tag>
                )}
                {(levelRange[0] !== 1 || levelRange[1] !== 15.7) && (
                  <Tag color="purple" closable onClose={() => setLevelRange([1, 15.7])}>
                    等级: {levelRange[0]} - {levelRange[1]}
                  </Tag>
                )}
              </div>
            </Card>

            <Card>
              <Table
                columns={columns}
                dataSource={filteredSongs}
                rowKey="songId"
                onRow={(record) => ({
                  style: { cursor: 'pointer' },
                  onClick: () => handleSongClick(record)
                })}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
                scroll={{ x: 'max-content' }}
                size="middle"
              />
            </Card>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Paragraph type="secondary">
                总计: {songs.length} 首歌曲 | 当前显示: {filteredSongs.length} 首歌曲
              </Paragraph>
            </div>

      {/* 抽取动画弹窗 */}
      <Modal
        title="随机抽取中..."
        open={drawAnimationVisible}
        closable={false}
        footer={null}
        width={700}
        centered
        maskClosable={false}
        styles={{
          body: {
            background: '#ffffff',
            borderRadius: '12px'
          }
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#333' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '30px',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.5))'
          }}>
            🎵
          </div>
          
          <div style={{ 
            fontSize: '24px', 
            marginBottom: '30px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            歌曲抽取中...
          </div>
          
          {currentDrawnSong && (
            <div style={{ 
              background: 'rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px',
              margin: '20px auto',
              maxWidth: '500px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              animation: 'pulse 2s ease-in-out infinite',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                marginBottom: '16px', 
                color: '#333',
                textAlign: 'center',
                fontSize: '24px'
              }}>
                {currentDrawnSong.title}
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#666',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {currentDrawnSong.artist}
              </p>
              
              {!isDrawing && currentDrawnSong.imageUrl && (
                <div style={{ 
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Image
                    src={currentDrawnSong.imageUrl}
                    alt={currentDrawnSong.title}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      border: '2px solid #667eea',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    preview={false}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                {currentDrawnSong.difficulty && (
                  <Tag color={difficultyColors[currentDrawnSong.difficulty] || 'default'}>
                    {currentDrawnSong.difficulty}
                  </Tag>
                )}
                {currentDrawnSong.version && (
                  <Tag color={versionColors[currentDrawnSong.version] || 'default'}>
                    {currentDrawnSong.version}
                  </Tag>
                )}
                {currentDrawnSong.type && (
                  <Tag color={typeColors[currentDrawnSong.type] || 'default'}>
                    {currentDrawnSong.type}
                  </Tag>
                )}
              </div>
            </div>
          )}
        </div>
        
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes fadeInOut {
            0% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.3; transform: scale(0.95); }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
            50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.6); }
            100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
          }
          `}
        </style>
      </Modal>
      
      {/* 歌曲详情弹窗 */}
      <Modal
        title="歌曲详情"
        open={songDetailModalVisible}
        onCancel={() => setSongDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setSongDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        centered
      >
        {selectedSong && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  {selectedSong.imageUrl ? (
                    <Image
                      src={selectedSong.imageUrl}
                      alt={selectedSong.title}
                      style={{ 
                        maxWidth: '100%', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrKL1AoO8WgLl0AAAAASUVORK5CYII="
                    />
                  ) : (
                    <div style={{ 
                      width: '200px', 
                      height: '200px', 
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      暂无封面
                    </div>
                  )}
                </div>
              </Col>
              <Col span={16}>
                <div style={{ padding: '16px' }}>
                  <Title level={3} style={{ marginBottom: '16px' }}>
                    {selectedSong.title}
                  </Title>
                  
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <strong>曲师：</strong>
                      <span style={{ marginLeft: '8px' }}>{selectedSong.artist || '未知'}</span>
                    </Col>
                    
                    {selectedSong.bpm && (
                      <Col span={24}>
                        <strong>BPM：</strong>
                        <span style={{ marginLeft: '8px' }}>{selectedSong.bpm}</span>
                      </Col>
                    )}
                    
                    <Col span={24}>
                      <strong>版本：</strong>
                      <span style={{ marginLeft: '8px' }}>
                        <Tag color={getVersionColor(selectedSong.version)}>
                          {selectedSong.version || '未知版本'}
                        </Tag>
                      </span>
                    </Col>
                    
                    <Col span={24}>
                      <strong>类型：</strong>
                      <span style={{ marginLeft: '8px' }}>
                        <Tag color={getTypeColor(selectedSong.type)}>
                          {selectedSong.type || '未知类型'}
                        </Tag>
                      </span>
                    </Col>
                  </Row>
                  
                  <Divider />
                  
                  <div>
                    <Title level={4}>谱面信息</Title>
                    <Row gutter={[16, 16]}>
                      {selectedSong.sheets.map((sheet, index) => (
                        <Col span={12} key={index}>
                          <Card size="small" style={{ marginBottom: '8px' }}>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color={getDifficultyColor(sheet.difficulty)}>
                                {sheet.difficulty}
                              </Tag>
                              <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                                Level {typeof sheet.internalLevelValue === 'number' ? sheet.internalLevelValue.toFixed(1) : sheet.level}
                              </span>
                            </div>
                            
                            {sheet.notes && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <div>总音符数: {sheet.notes}</div>
                              </div>
                            )}
                            
                            {sheet.charter && (
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                <div>谱师: {sheet.charter}</div>
                              </div>
                            )}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
          </>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ChunithmSongs;