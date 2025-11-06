// 数据类型定义，基于 arcade-songs-master 项目

// 基础类型定义
export type Song = {
  songId: string | null;
  category?: string;
  title?: string;
  artist?: string;
  bpm?: number;
  imageName?: string;
  version?: string;
  releaseDate?: string;
  isNew?: boolean;
  isLocked?: boolean;
  comment?: string;
  sheets: Sheet[];
  
  // 预处理添加的字段
  songNo: number;
  imageUrl?: string;
  imageUrlM?: string;
};

export type Sheet = {
  type?: string;
  difficulty?: string;
  level?: string;
  levelValue?: number;
  internalLevel?: string;
  internalLevelValue?: number;
  noteDesigner?: string;
  noteCounts?: Record<string, number | null>;
  regions?: Record<string, boolean>;
  regionOverrides?: Record<string, Sheet>;
  isSpecial?: boolean;
  
  // 预处理添加的字段
  sheetExpr?: string;
  notePercents?: Record<string, number | null>;
  searchUrl?: string | null;
};

// 筛选器类型定义
export type Filters = {
  categories: string[];
  title: string | null;
  matchExactTitle: boolean | null;
  artist: string | null;
  matchExactArtist: boolean | null;
  versions: string[];
  minBPM: number | null;
  maxBPM: number | null;
  syncBPM: boolean | null;
  types: string[];
  difficulties: string[];
  minLevelValue: number | null;
  maxLevelValue: number | null;
  syncLevelValue: boolean | null;
  useInternalLevel: boolean | null;
  noteDesigners: string[];
  region: string | null;
  useRegionOverride: boolean | null;
  superFilter: string | null;
};

export type FilterOption<T> = {
  text: string;
  value: T;
  count?: number;
};

export type FilterOptions = {
  categories: FilterOption<string>[] | null;
  titles: string[] | null;
  artists: string[] | null;
  versions: FilterOption<string>[] | null;
  bpms: number[] | null;
  types: FilterOption<string>[] | null;
  difficulties: FilterOption<string>[] | null;
  extraDifficulties: FilterOption<string>[] | null;
  levels: FilterOption<number>[] | null;
  internalLevels: FilterOption<number>[] | null;
  noteDesigners: FilterOption<string>[] | null;
  regions: FilterOption<string>[] | null;
};

// 数据类型定义
export type Data = {
  songs: Song[];
  sheets: Sheet[];
  categories: Category[];
  versions: Version[];
  types: Type[];
  difficulties: Difficulty[];
  regions: Region[];
  updateTime: string;
};

export type Category = {
  category: string;
  name?: string;
  color?: string;
};

export type Version = {
  version: string;
  name?: string;
  abbr?: string;
  color?: string;
};

export type Type = {
  type: string;
  name?: string;
  abbr?: string;
  color?: string;
  iconUrl?: string;
  iconHeight?: number;
};

export type Difficulty = {
  difficulty: string;
  name?: string;
  color?: string;
  iconUrl?: string;
  iconHeight?: number;
};

export type Region = {
  region: string;
  name?: string;
  color?: string;
};