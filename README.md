# creatL's Blog

creatL 的个人主页与轻量工具站。项目以 React 单页应用为主体，提供个人介绍、文章入口、工具集合，以及重新整理后的音游曲库查询体验。

在线预览：[https://cr3atl.github.io/creatl-s-blog](https://cr3atl.github.io/creatl-s-blog)

## 当前功能

- **首页**：个人介绍、社交入口、站点动态、工具入口和曲库入口。
- **文章**：轻量文章列表，保留后续扩展详情页、标签和归档的结构。
- **工具页**：集中展示当前可用工具和后续规划。
- **随机兔子图片**：从本地素材集中随机展示图片，并支持下载。
- **比赛报名**：保留中的轻量报名表单入口。
- **Song Catalog 曲库**：覆盖 maimai DX、CHUNITHM、SOUND VOLTEX EXCEED GEAR，支持筛选、排序、网格/详情/摘要视图、谱面详情和随机抽谱面历史。
- **黑白终端主题**：站点采用克制的黑白视觉系统，并统一 Ant Design 控件的暗色样式。
- **GitHub Pages 部署**：支持 `/creatl-s-blog` 子路径和 SPA 深链刷新 fallback。

## 曲库能力

曲库入口位于：

```txt
/songs
/songs/maimai
/songs/chunithm
/songs/sdvx
```

曲库数据实时读取 arcade-songs mirror CDN：

```txt
https://dp4p6x0xfi5o9.cloudfront.net/maimai
https://dp4p6x0xfi5o9.cloudfront.net/chunithm
https://dp4p6x0xfi5o9.cloudfront.net/sdvx
```

当前曲库交互包括：

- 每页 48 / 96 / 144 个谱面。
- 摘要视图不分页，直接统计完整筛选结果。
- 默认按 `No.` 排序。
- maimai 摘要页版本分布按版本从新到旧排序。
- 难度分布按 `RE:MASTER -> MASTER -> EXPERT/EXP -> ADVANCED/ADV -> BASIC` 展示。
- maimai / CHUNITHM 支持物量与物量占比排序。
- 版本、类型、难度等排序会优先使用远端 `data.json` 中的顺序元数据。

## 技术栈

- React 19
- React Router DOM 7
- Ant Design 5
- Create React App / react-scripts
- Jest + React Testing Library
- GitHub Pages + GitHub Actions

## 项目结构

```txt
src/
├── Page/                         # 页面入口
├── components/                   # 通用布局、导航、外壳和氛围组件
├── data/                         # 工具与站点数据
├── features/
│   └── song-catalog/             # 当前曲库功能
├── hooks/                        # 通用 hooks
├── icons/                        # 图标与曲库入口资源
├── styles/                       # 全局样式、主题令牌和页面样式
├── theme/                        # Ant Design 主题配置
└── utils/                        # 通用工具函数
```

历史曲库实现仍保存在：

```txt
src/archive/song-catalog/
```

该目录仅作为历史参考。新的线上曲库请使用 `src/features/song-catalog/`。

## 本地开发

环境要求：

- Node.js 18 或更高版本
- npm

安装依赖：

```bash
npm ci
```

启动开发服务器：

```bash
npm start
```

运行测试：

```bash
npm test -- --watchAll=false
```

构建生产版本：

```bash
npm run build
```

曲库相关回归测试：

```bash
npm test -- --runInBand --watchAll=false src/features/song-catalog/songCatalog.test.js
```

## 路由

```txt
/              首页
/home          首页别名
/article       文章
/tools         工具集合
/songs         曲库首页
/songs/maimai  maimai DX 曲库
/songs/chunithm CHUNITHM 曲库
/songs/sdvx    SOUND VOLTEX 曲库
/randomssiba   随机兔子图片
/race-signon   比赛报名
/about         关于
*              404
```

## 维护说明

- 不要把 `.agents/`、`docs/`、`demos/` 等过程文件纳入正式提交。
- 曲库新增游戏时，优先扩展 `src/features/song-catalog/config/games.js`，再补充对应排序、筛选和测试。
- 曲库数据适配应集中在 `normalizeSongData.js` 与 `filterSheets.js`，避免在 UI 组件里散落数据结构判断。
- 新工具优先加入 `src/data/tools.js`，复杂后再拆成独立 feature。
- 页面文案和源码统一使用 UTF-8。
- 修改主题或曲库后，至少运行相关测试；发布前建议运行完整测试和生产构建。

## 部署说明

- 生产站点部署在 GitHub Pages 的 `/creatl-s-blog` 子路径。
- `BrowserRouter` 的 `basename` 与 `package.json` 中的 `homepage` 必须保持一致。
- `public/404.html` 和 `public/index.html` 中的重定向脚本用于支持 SPA 深链刷新。
- GitHub Actions 工作流位于 `.github/workflows/static.yml`。

## License

当前仓库尚未添加独立 License 文件。
