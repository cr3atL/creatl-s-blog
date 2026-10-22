// 当前可用工具；首页目录与工具页共用入口。
const tools = [
  {
    key: 'random-image',
    title: '随机兔子图片',
    description: '随机查看本地兔子图片，支持换图和下载。',
    path: '/randomssiba',
    status: 'READY',
    analyticsLabel: 'Random_Image',
  },
  {
    key: 'song-catalog',
    title: '音游曲库',
    description: '查询 maimai DX、CHUNITHM 和 SOUND VOLTEX 的曲目与谱面，支持选曲、筛选、排序和随机抽谱面。',
    path: '/songs',
    status: 'READY',
    analyticsLabel: 'Song_Catalog',
  },
];

export default tools;
