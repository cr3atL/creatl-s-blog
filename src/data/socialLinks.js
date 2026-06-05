// Archive Terminal 社交链接数据
// 现有 Home.js 使用的所有外部链接与 analytics 平台标识保持一致。
// icon 字段仅做渲染键值，组件内部按 key 选择合适图标。
const socialLinks = [
  {
    key: 'github',
    label: 'GitHub',
    title: 'GitHub',
    url: 'https://github.com/cr3atL',
    platform: 'GitHub',
  },
  {
    key: 'bilibili',
    label: 'bilibili',
    title: 'bilibili 主页',
    url: 'https://space.bilibili.com/401366615?spm_id_from=333.1007.0.0/',
    platform: 'Bilibili',
  },
  {
    key: 'osu',
    label: 'OSU!',
    title: 'OSU! 主页',
    url: 'https://osu.ppy.sh/users/24792120',
    platform: 'OSU',
  },
  {
    key: 'netease',
    label: '网易云',
    title: '网易云歌单',
    url: 'https://music.163.com/playlist?id=12625543271&uct2=U2FsdGVkX1+cyjQGLYDuxxrxXWCr+2t5vb0lSKRkye4=',
    platform: 'Netease_Music',
  },
  {
    key: 'qq',
    label: 'QQ',
    title: '点击添加我的 QQ',
    url: 'https://qm.qq.com/q/MFdHgohGqm',
    platform: 'QQ',
  },
];

export default socialLinks;
