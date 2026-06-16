// Song catalog - game configurations
// Each game entry exposes the CDN endpoint, display label, icon asset,
// accent-free filter configuration and sheet normalization hints.

import maimaiDxIcon from '../../../icons/maimai-dx.jpg';
import chunithmIcon from '../../../icons/chunithm.jpg';
import sdvxExceedGearIcon from '../../../icons/sdvx-exceed-gear.jpg';

const COMMON_FIELDS = {
  song: {
    title: 'title',
    artist: 'artist',
    version: 'version',
    type: 'type',
    category: 'category',
    sheets: 'sheets',
  },
  sheet: {
    difficulty: 'difficulty',
    levelValue: 'levelValue',
    internalLevelValue: 'internalLevelValue',
    level: 'level',
    type: 'type',
    noteDesigner: 'noteDesigner',
    charter: 'charter',
  },
};

const COMMON_SORT_OPTIONS = [
  { key: 'songNo', label: 'No.' },
  { key: 'category', label: '分类' },
  { key: 'title', label: '曲名' },
  { key: 'artist', label: '艺术家' },
  { key: 'type', label: '类型' },
  { key: 'difficulty', label: '难度' },
  { key: 'levelValue', label: '等级' },
  { key: 'internalLevelValue', label: '定数' },
  { key: 'bpm', label: 'BPM' },
  { key: 'version', label: '版本' },
  { key: 'releaseDate', label: '发行日' },
];

const NOTE_SORT_OPTIONS = {
  maimai: [
    { key: 'noteTap', label: 'TAP' },
    { key: 'noteTapPercent', label: 'TAP %' },
    { key: 'noteHold', label: 'HOLD' },
    { key: 'noteHoldPercent', label: 'HOLD %' },
    { key: 'noteSlide', label: 'SLIDE' },
    { key: 'noteSlidePercent', label: 'SLIDE %' },
    { key: 'noteTouch', label: 'TOUCH' },
    { key: 'noteTouchPercent', label: 'TOUCH %' },
    { key: 'noteBreak', label: 'BREAK' },
    { key: 'noteBreakPercent', label: 'BREAK %' },
    { key: 'noteTotal', label: '总物量' },
  ],
  chunithm: [
    { key: 'noteTap', label: 'TAP' },
    { key: 'noteTapPercent', label: 'TAP %' },
    { key: 'noteHold', label: 'HOLD' },
    { key: 'noteHoldPercent', label: 'HOLD %' },
    { key: 'noteSlide', label: 'SLIDE' },
    { key: 'noteSlidePercent', label: 'SLIDE %' },
    { key: 'noteAir', label: 'AIR' },
    { key: 'noteAirPercent', label: 'AIR %' },
    { key: 'noteFlick', label: 'FLICK' },
    { key: 'noteFlickPercent', label: 'FLICK %' },
    { key: 'noteTotal', label: '总物量' },
  ],
};

const buildSortOptions = (gameId) => [
  ...COMMON_SORT_OPTIONS,
  ...(NOTE_SORT_OPTIONS[gameId] || []),
];

const MAIMAI_VERSION_ORDER_NEWEST_FIRST = [
  'CiRCLE PLUS',
  'CiRCLE',
  'PRiSM PLUS',
  'PRiSM',
  'BUDDiES PLUS',
  'BUDDiES',
  'FESTiVAL PLUS',
  'FESTiVAL',
  'UNiVERSE PLUS',
  'UNiVERSE',
  'Splash PLUS',
  'Splash',
  'maimaiでらっくす PLUS',
  'maimaiでらっくす',
  'DX PLUS',
  'DX',
  'FiNALE',
  'MiLK PLUS',
  'MiLK',
  'MURASAKi PLUS',
  'MURASAKi',
  'PiNK PLUS',
  'PiNK',
  'ORANGE PLUS',
  'ORANGE',
  'GreeN PLUS',
  'GreeN',
  'maimai PLUS',
  'maimai',
];

const games = [
  {
    id: 'maimai',
    label: 'MAIMAI DX',
    path: '/songs/maimai',
    icon: maimaiDxIcon,
    iconSource: 'SEGA Fave Store — maimai deluxe official fanbook',
    iconUrl: 'https://segafavestore.jp/products/maimaidx_officialfanbook',
    dataSource: 'https://dp4p6x0xfi5o9.cloudfront.net/maimai',
    shortDescription: 'maimai deluxe 曲目与谱面索引。',
    sortOptions: buildSortOptions('maimai'),
    summaryVersionOrder: MAIMAI_VERSION_ORDER_NEWEST_FIRST,
    filterConfig: {
      fields: COMMON_FIELDS,
      levelRange: { min: 1, max: 15, step: 0.1, default: [1, 15] },
      sheetMatchBehavior: 'prune',
    },
  },
  {
    id: 'chunithm',
    label: 'CHUNITHM',
    path: '/songs/chunithm',
    icon: chunithmIcon,
    iconSource: 'Yamaha MEH — CHUNITHM piano concert',
    iconUrl: 'https://www.yamaha-meh.co.jp/business/event/sega-chunithm/',
    dataSource: 'https://dp4p6x0xfi5o9.cloudfront.net/chunithm',
    shortDescription: 'CHUNITHM 曲目与谱面索引。',
    sortOptions: buildSortOptions('chunithm'),
    filterConfig: {
      fields: COMMON_FIELDS,
      levelRange: { min: 1, max: 15.7, step: 0.1, default: [1, 15.7] },
      sheetMatchBehavior: 'prune',
    },
  },
  {
    id: 'sdvx',
    label: 'SOUND VOLTEX EG',
    path: '/songs/sdvx',
    icon: sdvxExceedGearIcon,
    iconSource: 'SteamGridDB — Sound Voltex Exceed Gear',
    iconUrl: 'https://www.steamgriddb.com/game/5363674/icons',
    dataSource: 'https://dp4p6x0xfi5o9.cloudfront.net/sdvx',
    shortDescription: 'SOUND VOLTEX EXCEED GEAR 曲目与谱面索引。',
    sortOptions: buildSortOptions('sdvx'),
    filterConfig: {
      fields: COMMON_FIELDS,
      levelRange: { min: 1, max: 20, step: 0.1, default: [1, 20] },
      sheetMatchBehavior: 'prune',
    },
  },
];

export const getGameById = (gameId) => games.find((game) => game.id === gameId);

export const getGameByPath = (pathname) => {
  if (!pathname) return null;
  const trimmed = pathname.replace(/\/+$/, '');
  return games.find((game) => game.path === trimmed) || null;
};

export default games;
