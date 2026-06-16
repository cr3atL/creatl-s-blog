// 首页 Archive Log 数据
// 静态条目，按最新到最旧排序，方便后续追加或切换为真实数据源。
// 分类使用档案站内部标签：THEME / TOOLS / NOTE / SIGNAL。
const archiveLogs = [
  {
    id: 'song-catalog-launch',
    date: '2026.06',
    category: 'TOOLS',
    title: '曲库上线',
    summary: 'maimai、CHUNITHM 和 SOUND VOLTEX 的曲库入口已经开放。',
  },
  {
    id: 'tools-page-refresh',
    date: '2026.06',
    category: 'TOOLS',
    title: '工具页更新',
    summary: '随机图片、曲库和报名入口集中到了工具页，方便快速访问。',
  },
  {
    id: 'writing-collection',
    date: '2026.06',
    category: 'NOTE',
    title: '开始记录',
    summary: '把零散的笔记、想法和项目记录慢慢整理到文章区。',
  },
  {
    id: 'archive-theme',
    date: '2026.06',
    category: 'THEME',
    title: '黑白档案主题',
    summary: '站点采用克制的黑白档案视觉，强调编号与状态。',
  },
  {
    id: 'station-weather',
    date: '2026.05',
    category: 'SIGNAL',
    title: '天气模块上线',
    summary: '首页加入了虚构站内天气，会随时间慢慢变化。',
  },
  {
    id: 'station-online',
    date: '2026.05',
    category: 'SIGNAL',
    title: 'Station 上线',
    summary: '站内状态、档案与社交通道进入稳定运行。',
  },
];

export default archiveLogs;
