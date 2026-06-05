// Archive Terminal 首页 Archive Log 数据
// 静态条目，按最新到最旧排序，方便后续追加或切换为真实数据源。
// 分类使用档案站内部标签：THEME / TOOLS / NOTE / SIGNAL。
const archiveLogs = [
  {
    id: 'theme-archive-terminal',
    date: '2026.06',
    category: 'THEME',
    title: 'Archive Terminal 重构中',
    summary:
      '正在把整站迁到 Archive Terminal 视觉：黑白琥珀主调、ASCII 海洋、档案 Feed。',
  },
  {
    id: 'tools-process-queue',
    date: '2026.06',
    category: 'TOOLS',
    title: '工具入口整理中',
    summary: '把首页和工具页的工具入口统一为 process row，去掉分散的卡片样式。',
  },
  {
    id: 'note-articles-organizing',
    date: '2026.06',
    category: 'NOTE',
    title: '文章系统准备中',
    summary: '文章页会改为 Editorial Archive Feed，旧文章按时间线重排。',
  },
  {
    id: 'signal-station-online',
    date: '2026.05',
    category: 'SIGNAL',
    title: 'Station 上线',
    summary: '站内天气、档案状态和社交通道都进入稳定状态，等待更新。',
  },
];

export default archiveLogs;
