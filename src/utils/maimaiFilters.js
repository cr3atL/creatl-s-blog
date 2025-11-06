// 创建默认筛选条件
export function createDefaultFilters() {
  return {
    categories: [],
    title: null,
    matchExactTitle: false,
    artist: null,
    matchExactArtist: false,
    versions: [],
    minBPM: null,
    maxBPM: null,
    syncBPM: false,
    types: [],
    difficulties: [],
    minLevelValue: null,
    maxLevelValue: null,
    syncLevelValue: false,
    useInternalLevel: false,
    noteDesigners: [],
    region: null,
    useRegionOverride: false,
    superFilter: null,
  };
}

// 从URL参数解析筛选条件
export function parseFiltersFromURL(urlParams) {
  const filters = createDefaultFilters();
  
  // 解析数组类型的参数
  const parseArrayParam = (paramName) => {
    const param = urlParams.get(paramName);
    return param ? param.split(',').filter(Boolean) : [];
  };
  
  // 解析布尔类型的参数
  const parseBoolParam = (paramName) => {
    const param = urlParams.get(paramName);
    return param === 'true' ? true : param === 'false' ? false : null;
  };
  
  // 解析数字类型的参数
  const parseNumberParam = (paramName) => {
    const param = urlParams.get(paramName);
    return param ? parseFloat(param) : null;
  };
  
  // 应用各种筛选条件
  filters.categories = parseArrayParam('categories');
  filters.title = urlParams.get('title');
  filters.matchExactTitle = parseBoolParam('matchExactTitle');
  filters.artist = urlParams.get('artist');
  filters.matchExactArtist = parseBoolParam('matchExactArtist');
  filters.versions = parseArrayParam('versions');
  filters.minBPM = parseNumberParam('minBPM');
  filters.maxBPM = parseNumberParam('maxBPM');
  filters.syncBPM = parseBoolParam('syncBPM');
  filters.types = parseArrayParam('types');
  filters.difficulties = parseArrayParam('difficulties');
  filters.minLevelValue = parseNumberParam('minLevelValue');
  filters.maxLevelValue = parseNumberParam('maxLevelValue');
  filters.syncLevelValue = parseBoolParam('syncLevelValue');
  filters.useInternalLevel = parseBoolParam('useInternalLevel');
  filters.noteDesigners = parseArrayParam('noteDesigners');
  filters.region = urlParams.get('region');
  filters.useRegionOverride = parseBoolParam('useRegionOverride');
  filters.superFilter = urlParams.get('superFilter');
  
  return filters;
}

// 将筛选条件转换为URL参数
export function filtersToURLParams(filters) {
  const params = new URLSearchParams();
  
  // 添加数组类型的参数
  const addArrayParam = (paramName, values) => {
    if (values.length > 0) {
      params.set(paramName, values.join(','));
    }
  };
  
  // 添加布尔类型的参数
  const addBoolParam = (paramName, value) => {
    if (value !== null && value !== false) {
      params.set(paramName, value.toString());
    }
  };
  
  // 添加数字类型的参数
  const addNumberParam = (paramName, value) => {
    if (value !== null) {
      params.set(paramName, value.toString());
    }
  };
  
  // 应用各种筛选条件
  addArrayParam('categories', filters.categories);
  if (filters.title) params.set('title', filters.title);
  addBoolParam('matchExactTitle', filters.matchExactTitle);
  if (filters.artist) params.set('artist', filters.artist);
  addBoolParam('matchExactArtist', filters.matchExactArtist);
  addArrayParam('versions', filters.versions);
  addNumberParam('minBPM', filters.minBPM);
  addNumberParam('maxBPM', filters.maxBPM);
  addBoolParam('syncBPM', filters.syncBPM);
  addArrayParam('types', filters.types);
  addArrayParam('difficulties', filters.difficulties);
  addNumberParam('minLevelValue', filters.minLevelValue);
  addNumberParam('maxLevelValue', filters.maxLevelValue);
  addBoolParam('syncLevelValue', filters.syncLevelValue);
  addBoolParam('useInternalLevel', filters.useInternalLevel);
  addArrayParam('noteDesigners', filters.noteDesigners);
  if (filters.region) params.set('region', filters.region);
  addBoolParam('useRegionOverride', filters.useRegionOverride);
  if (filters.superFilter) params.set('superFilter', filters.superFilter);
  
  return params;
}

// 应用筛选条件
export function applyFilters(songs, filters) {
  return songs.filter(song => {
    // 分类筛选
    if (filters.categories.length > 0 && (!song.category || !filters.categories.includes(song.category))) {
      return false;
    }
    
    // 标题筛选
    if (filters.title) {
      const title = song.title || '';
      if (filters.matchExactTitle) {
        if (title !== filters.title) return false;
      } else {
        if (!title.toLowerCase().includes(filters.title.toLowerCase())) return false;
      }
    }
    
    // 艺术家筛选
    if (filters.artist) {
      const artist = song.artist || '';
      if (filters.matchExactArtist) {
        if (artist !== filters.artist) return false;
      } else {
        if (!artist.toLowerCase().includes(filters.artist.toLowerCase())) return false;
      }
    }
    
    // 版本筛选
    if (filters.versions.length > 0 && (!song.version || !filters.versions.includes(song.version))) {
      return false;
    }
    
    // BPM筛选
    if (song.bpm) {
      if (filters.minBPM !== null && song.bpm < filters.minBPM) return false;
      if (filters.maxBPM !== null && song.bpm > filters.maxBPM) return false;
    }
    
    // 类型筛选
    const songTypes = song.sheets ? [...new Set(song.sheets.map(sheet => sheet.type).filter(Boolean))] : [];
    if (filters.types.length > 0 && !songTypes.some(type => filters.types.includes(type || ''))) {
      return false;
    }
    
    // 难度筛选
    const songDifficulties = song.sheets ? [...new Set(song.sheets.map(sheet => sheet.difficulty).filter(Boolean))] : [];
    if (filters.difficulties.length > 0 && !songDifficulties.some(diff => filters.difficulties.includes(diff || ''))) {
      return false;
    }
    
    // 等级筛选
    if (filters.minLevelValue !== null || filters.maxLevelValue !== null) {
      const hasMatchingLevel = song.sheets?.some(sheet => {
        const levelValue = filters.useInternalLevel && sheet.internalLevelValue !== undefined
          ? sheet.internalLevelValue
          : sheet.levelValue;
          
        if (levelValue === undefined) return false;
        
        if (filters.minLevelValue !== null && levelValue < filters.minLevelValue) return false;
        if (filters.maxLevelValue !== null && levelValue > filters.maxLevelValue) return false;
        
        return true;
      });
      
      if (!hasMatchingLevel) return false;
    }
    
    // 谱面设计师筛选
    if (filters.noteDesigners.length > 0) {
      const hasMatchingDesigner = song.sheets?.some(sheet => 
        sheet.noteDesigner && filters.noteDesigners.includes(sheet.noteDesigner)
      );
      if (!hasMatchingDesigner) return false;
    }
    
    // 地区筛选
    if (filters.region) {
      const hasMatchingRegion = song.sheets?.some(sheet => {
        if (filters.useRegionOverride && sheet.regionOverrides) {
          const override = sheet.regionOverrides[filters.region];
          if (override) return true;
        }
        
        if (sheet.regions) {
          return sheet.regions[filters.region] === true;
        }
        
        return false;
      });
      
      if (!hasMatchingRegion) return false;
    }
    
    // 超级筛选（高级筛选）
    if (filters.superFilter) {
      try {
        // 创建一个安全的评估环境
        const safeEval = new Function('song', 'sheet', `
          const { title, artist, bpm, version, category, isNew, isLocked, comment } = song;
          return ${filters.superFilter};
        `);
        
        const hasMatchingSuperFilter = song.sheets?.some(sheet => {
          try {
            return safeEval(song, sheet);
          } catch (e) {
            console.error('超级筛选表达式错误:', e);
            return false;
          }
        });
        
        if (!hasMatchingSuperFilter) return false;
      } catch (e) {
        console.error('超级筛选表达式解析错误:', e);
      }
    }
    
    return true;
  });
}

// 创建筛选选项
export function createFilterOptions(data) {
  // 收集所有可能的选项
  const categories = [...new Set(data.songs.map(song => song.category).filter(Boolean))];
  const titles = [...new Set(data.songs.map(song => song.title).filter(Boolean))];
  const artists = [...new Set(data.songs.map(song => song.artist).filter(Boolean))];
  const versions = [...new Set(data.songs.map(song => song.version).filter(Boolean))];
  const types = [...new Set(data.sheets.map(sheet => sheet.type).filter(Boolean))];
  const difficulties = [...new Set(data.sheets.map(sheet => sheet.difficulty).filter(Boolean))];
  const noteDesigners = [...new Set(data.sheets.map(sheet => sheet.noteDesigner).filter(Boolean))];
  const regions = data.regions.map(region => region.region);
  
  // 收集BPM值
  const bpms = [...new Set(data.songs.map(song => song.bpm).filter(bpm => bpm !== undefined && bpm !== null))];
  
  // 收集等级值
  const levels = [...new Set(data.sheets.map(sheet => sheet.levelValue).filter(level => level !== undefined && level !== null))];
  const internalLevels = [...new Set(data.sheets.map(sheet => sheet.internalLevelValue).filter(level => level !== undefined && level !== null))];
  
  // 创建选项对象
  return {
    categories: categories.map(cat => ({
      text: cat || '',
      value: cat || '',
      count: data.songs.filter(song => song.category === cat).length,
    })),
    titles: titles,
    artists: artists,
    versions: versions.map(ver => ({
      text: ver || '',
      value: ver || '',
      count: data.songs.filter(song => song.version === ver).length,
    })),
    bpms: bpms.sort((a, b) => a - b),
    types: types.map(type => ({
      text: type || '',
      value: type || '',
      count: data.songs.filter(song => song.sheets?.some(sheet => sheet.type === type)).length,
    })),
    difficulties: difficulties.map(diff => ({
      text: diff || '',
      value: diff || '',
      count: data.songs.filter(song => song.sheets?.some(sheet => sheet.difficulty === diff)).length,
    })),
    extraDifficulties: [], // 可以在这里添加额外难度选项
    levels: levels.sort((a, b) => a - b).map(level => ({
      text: level.toString(),
      value: level,
      count: data.songs.filter(song => song.sheets?.some(sheet => sheet.levelValue === level)).length,
    })),
    internalLevels: internalLevels.sort((a, b) => a - b).map(level => ({
      text: level.toString(),
      value: level,
      count: data.songs.filter(song => song.sheets?.some(sheet => sheet.internalLevelValue === level)).length,
    })),
    noteDesigners: noteDesigners.map(designer => ({
      text: designer || '',
      value: designer || '',
      count: data.sheets.filter(sheet => sheet.noteDesigner === designer).length,
    })),
    regions: regions.map(region => ({
      text: region || '',
      value: region || '',
      count: data.sheets.filter(sheet => sheet.regions && sheet.regions[region] === true).length,
    })),
  };
}

// 计算活跃筛选条件数量
export function countActiveFilters(filters) {
  let count = 0;
  
  if (filters.categories.length > 0) count++;
  if (filters.title) count++;
  if (filters.matchExactTitle) count++;
  if (filters.artist) count++;
  if (filters.matchExactArtist) count++;
  if (filters.versions.length > 0) count++;
  if (filters.minBPM !== null) count++;
  if (filters.maxBPM !== null) count++;
  if (filters.syncBPM) count++;
  if (filters.types.length > 0) count++;
  if (filters.difficulties.length > 0) count++;
  if (filters.minLevelValue !== null) count++;
  if (filters.maxLevelValue !== null) count++;
  if (filters.syncLevelValue) count++;
  if (filters.useInternalLevel) count++;
  if (filters.noteDesigners.length > 0) count++;
  if (filters.region) count++;
  if (filters.useRegionOverride) count++;
  if (filters.superFilter) count++;
  
  return count;
}

// 重置筛选条件
export function resetFilters() {
  return createDefaultFilters();
}