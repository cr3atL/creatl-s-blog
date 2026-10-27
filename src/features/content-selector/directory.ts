import games from '../song-catalog/config/games';
import tools from '../../data/tools';
import playableGames from '../../data/games';
import type { ContentEntry, FolderId } from './types';

export const rootEntries: ContentEntry[] = [
  { id: 'catalog', kind: 'folder', folder: 'catalog', title: '音游曲库', icon: 'catalog' },
  { id: 'article', kind: 'route', path: '/article', title: '文章与记录', icon: 'article', analyticsLabel: 'Writing_Preview' },
  { id: 'tools', kind: 'folder', folder: 'tools', title: '小工具', icon: 'tools' },
  { id: 'games', kind: 'folder', folder: 'games', title: '游戏', icon: 'game' },
  { id: 'about', kind: 'route', path: '/about', title: '关于我', icon: 'about', analyticsLabel: 'About_Snapshot' },
];

export const directory: Record<FolderId, { title: string; entries: ContentEntry[] }> = {
  root: { title: 'creatL', entries: rootEntries },
  catalog: {
    title: '音游曲库',
    entries: games.map((game) => ({
      id: game.id, kind: 'route', path: game.path, icon: 'game',
      title: game.id === 'maimai' ? 'maimai DX' : game.id === 'sdvx' ? 'SOUND VOLTEX' : game.label,
      analyticsLabel: `Song_Catalog_${game.id}`,
    })),
  },
  tools: {
    title: '小工具',
    entries: tools.filter((tool) => tool.key !== 'song-catalog').map((tool) => ({
      id: tool.key, kind: 'route', path: tool.path, title: tool.title,
      icon: 'image', analyticsLabel: tool.analyticsLabel,
    })),
  },
  games: {
    title: '游戏',
    entries: playableGames.map((game) => ({
      id: game.key, kind: 'route', path: game.path, title: game.title,
      external: true, icon: 'game', analyticsLabel: game.analyticsLabel,
    })),
  },
};

export const navigationRoutes = [
  { path: '/', title: '首页' },
  { path: '/songs', title: '曲库' },
  ...rootEntries.filter((entry) => entry.kind === 'route').map((entry) => ({
    path: entry.path, title: entry.id === 'article' ? '文章' : '关于',
  })),
  { path: '/tools', title: '工具' },
  { path: '/games', title: '游戏' },
];
