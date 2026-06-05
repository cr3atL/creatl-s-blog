// Archive Terminal 工具入口数据
// 字段保持扁平，避免页面或卡片组件直接依赖 Ant Design 图标节点。
// 现有可用工具路径、analytics 标签和文案必须保留。
const tools = [
  {
    key: 'random-image',
    number: '001',
    category: 'IMAGE',
    title: '随机兔子图片',
    description: '从本地图片集中随机抽一张兔子图片，适合放松一下。',
    path: '/randomssiba',
    status: 'READY',
    analyticsLabel: 'Random_Image',
  },
  {
    key: 'race-signon',
    number: '002',
    category: 'FORM',
    title: '比赛报名',
    description: '保留中的轻量报名工具，后续可以继续完善表单流程。',
    path: '/race-signon',
    status: 'DRAFT',
    analyticsLabel: 'Race_Signon',
  },
];

export default tools;
