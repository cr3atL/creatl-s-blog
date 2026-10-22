export type GameId = 'maimai' | 'chunithm' | 'sdvx';
export type LevelRange = [number, number];
export type NoteCounts = Record<string, number | null>;

export interface Sheet {
  id: string;
  difficulty: string;
  level: string;
  levelValue: number | null;
  internalLevelValue: number | null;
  type: string;
  noteDesigner: string;
  notes: number | null;
  noteCounts: NoteCounts | null;
  notePercents: NoteCounts | null;
  imageUrl: string | null;
}

export interface Song {
  id: string;
  songId: string;
  songNo: number;
  title: string;
  artist: string;
  version: string;
  releaseDate: string;
  type: string;
  category: string;
  bpm: number | null;
  imageUrl: string | null;
  sheets: Sheet[];
  allSheets?: Sheet[];
}

export interface CatalogSheet extends Sheet {
  songId: string;
  songNo: number;
  songTitle: string;
  songArtist: string;
  songVersion: string;
  songReleaseDate: string;
  songType: string;
  songCategory: string;
  songBpm: number | null;
  songImageUrl: string | null;
  songSheets: Omit<Sheet, 'imageUrl'>[];
}

export interface CatalogData {
  songs: Song[];
  categories: { category: string; [key: string]: unknown }[];
  versions: { version: string; [key: string]: unknown }[];
  types: { type: string; [key: string]: unknown }[];
  difficulties: { difficulty: string; [key: string]: unknown }[];
  updateTime: string;
}

export interface FilterConfig {
  fields?: { song?: Record<string, string>; sheet?: Record<string, string> };
  levelRange: { min: number; max: number; step: number; default: LevelRange };
  sheetMatchBehavior?: 'prune';
  versionOrder?: string[];
  categoryOrder?: string[];
  typeOrder?: string[];
  difficultyOrder?: string[];
}

export interface Game {
  id: GameId;
  label: string;
  path: string;
  icon: string;
  iconSource: string;
  iconUrl: string;
  dataSource: string;
  shortDescription: string;
  sortOptions: { key: string; label: string }[];
  summaryVersionOrder?: string[];
  filterConfig: FilterConfig;
}

export interface SongFilters {
  searchText: string;
  difficultyFilter: string[];
  versionFilter: string[];
  typeFilter: string[];
  levelRange: LevelRange;
  pendingFilter: string[];
  artistFilter: string;
  noteDesignerFilter: string[];
  regionFilter: string[];
  bpmMin: number | null;
  bpmMax: number | null;
}

export interface ActiveFilterTag {
  key: keyof SongFilters | 'bpmRange';
  label: string;
  value: string;
}
