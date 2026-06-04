// 创建空的数据结构
export function buildEmptyData() {
  return {
    songs: [],
    sheets: [],
    categories: [],
    versions: [],
    types: [],
    difficulties: [],
    regions: [],
    updateTime: '',
  };
}

// 预处理数据
export function preprocessData(data) {
  const result = buildEmptyData();
  
  // 处理歌曲数据
  if (data.songs && Array.isArray(data.songs)) {
    // 为歌曲添加序号和图片URL
    const songsWithMetadata = data.songs.map((song, index) => {
      const songWithNo = {
        ...song,
        songNo: index + 1,
        imageUrl: song.imageName ? `https://maimai.sega.jp/img/music/${song.imageName}.png` : undefined,
        imageUrlM: song.imageName ? `https://maimai.sega.jp/img/music/${song.imageName}_m.png` : undefined,
      };
      
      // 处理谱面数据
      if (song.sheets && Array.isArray(song.sheets)) {
        songWithNo.sheets = song.sheets.map((sheet) => {
          const processedSheet = {
            ...sheet,
            sheetExpr: sheet.difficulty ? `${sheet.type}${sheet.difficulty}` : undefined,
            notePercents: sheet.noteCounts ? calculateNotePercents(sheet.noteCounts) : undefined,
            searchUrl: sheet.difficulty ? `https://www.youtube.com/results?search_query=maimai+${encodeURIComponent(song.title || '')}+${encodeURIComponent(sheet.difficulty)}` : null,
          };
          
          return Object.freeze(processedSheet);
        });
      }
      
      return Object.freeze(songWithNo);
    });
    
    // 反转歌曲数组并展平谱面
    result.songs = Object.freeze(songsWithMetadata.reverse());
    result.sheets = Object.freeze(
      songsWithMetadata.flatMap(song => song.sheets || [])
    );
  }
  
  // 处理其他数据类型
  if (data.categories && Array.isArray(data.categories)) {
    result.categories = Object.freeze(
      data.categories.map((cat) => {
        const processedCat = {
          ...cat,
          iconUrl: cat.category ? `https://maimai.sega.jp/img/category/${cat.category}.png` : undefined,
        };
        return Object.freeze(processedCat);
      })
    );
  }
  
  if (data.versions && Array.isArray(data.versions)) {
    result.versions = Object.freeze(
      data.versions.map((ver) => {
        const processedVer = {
          ...ver,
          iconUrl: ver.version ? `https://maimai.sega.jp/img/version/${ver.version}.png` : undefined,
        };
        return Object.freeze(processedVer);
      })
    );
  }
  
  if (data.types && Array.isArray(data.types)) {
    result.types = Object.freeze(
      data.types.map((type) => {
        const processedType = {
          ...type,
          iconUrl: type.type ? `https://maimai.sega.jp/img/type/${type.type}.png` : undefined,
        };
        return Object.freeze(processedType);
      })
    );
  }
  
  if (data.difficulties && Array.isArray(data.difficulties)) {
    result.difficulties = Object.freeze(
      data.difficulties.map((diff) => {
        const processedDiff = {
          ...diff,
          iconUrl: diff.difficulty ? `https://maimai.sega.jp/img/diff/${diff.difficulty}.png` : undefined,
        };
        return Object.freeze(processedDiff);
      })
    );
  }
  
  if (data.regions && Array.isArray(data.regions)) {
    result.regions = Object.freeze(
      data.regions.map((reg) => Object.freeze(reg))
    );
  }
  
  // 设置更新时间
  if (data.updateTime) {
    result.updateTime = data.updateTime;
  }
  
  return Object.freeze(result);
}

// 计算音符百分比
function calculateNotePercents(noteCounts) {
  const result = {};
  let total = 0;
  
  // 计算总音符数
  for (const key in noteCounts) {
    const count = noteCounts[key];
    if (typeof count === 'number' && count > 0) {
      total += count;
    }
  }
  
  // 计算每个类型的百分比
  for (const key in noteCounts) {
    const count = noteCounts[key];
    if (typeof count === 'number' && count > 0 && total > 0) {
      result[key] = Math.round((count / total) * 100);
    } else {
      result[key] = null;
    }
  }
  
  return result;
}

// 创建索引
export function createIndexes(data) {
  const songIndex = {};
  const sheetIndex = {};
  const categoryIndex = {};
  const versionIndex = {};
  const typeIndex = {};
  const difficultyIndex = {};
  const regionIndex = {};
  
  // 创建歌曲索引
  data.songs.forEach(song => {
    if (song.songId) {
      songIndex[song.songId] = song;
    }
  });
  
  // 创建谱面索引
  data.sheets.forEach((sheet, index) => {
    if (sheet.sheetExpr) {
      sheetIndex[sheet.sheetExpr] = sheet;
    } else {
      // 如果没有表达式，使用索引作为键
      sheetIndex[`sheet_${index}`] = sheet;
    }
  });
  
  // 创建分类索引
  data.categories.forEach(category => {
    categoryIndex[category.category] = category;
  });
  
  // 创建版本索引
  data.versions.forEach(version => {
    versionIndex[version.version] = version;
  });
  
  // 创建类型索引
  data.types.forEach(type => {
    typeIndex[type.type] = type;
  });
  
  // 创建难度索引
  data.difficulties.forEach(difficulty => {
    difficultyIndex[difficulty.difficulty] = difficulty;
  });
  
  // 创建地区索引
  data.regions.forEach(region => {
    regionIndex[region.region] = region;
  });
  
  return {
    songIndex,
    sheetIndex,
    categoryIndex,
    versionIndex,
    typeIndex,
    difficultyIndex,
    regionIndex,
  };
}