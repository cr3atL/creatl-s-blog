// 当前版本的项目进展，按最新到最旧排列。
const archiveLogs = [
  {
    id: 'games-and-catalog-scroll',
    date: '2026.10.23',
    title: '小游戏试玩与曲库滚动修复',
    summary: '小工具目录加入「再来一脚」与「赤隼 · Roadster」，直接打开独立试玩页面。修复选曲列表从底端拖回顶端时可能出现的空白，预览和选中项同步更新。',
  },
  {
    id: 'brand-home-refresh',
    date: '2026.10.22',
    title: '个人主页改版',
    summary: '以原始 Logo 为中心，采用奶油白与橙色。内容目录进入文件夹后只显示当前层，支持键盘选择和返回恢复。',
  },
  {
    id: 'song-selection-refresh',
    date: '2026.10.22',
    title: '曲库选曲界面',
    summary: 'maimai DX、CHUNITHM 和 SOUND VOLTEX 曲库默认使用选曲视图，保留筛选、排序、谱面详情、网格与摘要，以及随机抽谱面历史。',
  },
  {
    id: 'vite-typescript-migration',
    date: '2026.10.22',
    title: '迁移到 Vite、React 与 TypeScript',
    summary: '完成构建迁移和页面按需加载，保留 GitHub Pages 子路径与深层链接支持。',
  },
];

export default archiveLogs;
