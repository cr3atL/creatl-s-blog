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
    key: 'engine-start-random',
    title: '再来一脚',
    description: '拖动脚踏启动摩托，看看机械转盘和发动机会带来什么反应。',
    path: 'https://cr3atl.github.io/engine-start-random/',
    external: true,
    analyticsLabel: 'Engine_Start_Random',
  },
  {
    key: 'car-flycontral',
    title: '赤隼 · Roadster',
    description: '驾驶喷气跑车，在道路与高低平台之间寻找通往出口的路线。',
    path: 'https://cr3atl.github.io/car-flycontral/roadster.html',
    external: true,
    analyticsLabel: 'Car_Flycontral',
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
