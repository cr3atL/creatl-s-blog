# creatL's Blog

creatL 的个人主页与轻量工具站。项目以 React 单页应用为主体，提供个人介绍、文章入口、工具集合，以及重新整理后的音游曲库查询体验。

在线预览：[https://cr3atl.github.io/creatl-s-blog](https://cr3atl.github.io/creatl-s-blog)

## 当前功能

- **首页**：原始 Logo、个人介绍、真实社交入口和当前版本更新。内容目录进入后只显示当前层，支持键盘操作与返回恢复。
- **首页开场**：当前标签页首次进入首页时，中央 Logo 淡入、停留并平滑归位，介绍和目录逐步展开。桌面约 2.2 秒、窄屏约 1.9 秒；通过 sessionStorage 记忆，站内返回和刷新不重播。点击、键盘、滚动与尺寸变化立即结束动效；减少动态效果时只做短淡入，锚点和恢复滚动位置优先。
- **文章**：站点重构记录与个人文章；未完成文章保留明确状态和进度反馈。
- **工具页**：提供音游曲库和随机兔子图片两个可用入口。
- **随机兔子图片**：从本地素材集中随机展示图片，并支持下载。
- **Song Catalog 曲库**：覆盖 maimai DX、CHUNITHM、SOUND VOLTEX EXCEED GEAR，支持选曲、筛选、排序、网格/详情/摘要视图、谱面详情和随机抽谱面历史。
- **品牌主题**：默认采用奶油白、橙色、可可色和少量叶绿色，统一公共导航、页面和 Ant Design 控件。
- **全站动效**：共享 140/240/360ms 三档时长，统一正文、目录、选曲、弹窗、图片和控件反馈；系统减少动态效果时取消位移与缩放。首页保留独立品牌开场，查询与排序不重播整页动效。
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

- 网格与详情列表每页 48 / 96 / 144 个谱面；选曲视图支持当前谱面预览。
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
- Vite 7 + TypeScript 5（严格类型检查，渐进迁移）
- Vitest 4 + React Testing Library
- GitHub Pages + GitHub Actions

## 项目结构

```txt
src/
├── Page/                         # 页面入口
├── components/                   # 通用布局、导航、外壳和品牌组件
├── data/                         # 工具与站点数据
├── features/
│   ├── content-selector/         # 首页目录、选择与历史恢复
│   └── song-catalog/             # 当前曲库功能
├── hooks/                        # 通用 hooks
├── icons/                        # 图标与曲库入口资源
├── styles/                       # 全局样式、主题令牌和页面样式
├── theme/                        # Ant Design 主题配置
└── utils/                        # 通用工具函数
```

历史曲库实现保留在 `src/archive/song-catalog/`，仅作为历史参考。新的线上曲库在 `src/features/song-catalog/`。

## 本地开发

环境要求：

- Node.js 20.19+（20.x）、22.12+（22.x）或 24+（推荐 Node.js 22，见 `.nvmrc`）
- npm

安装依赖：

```bash
npm ci
```

启动开发服务器：

```bash
npm start
```

开发地址为 `http://localhost:5173/creatl-s-blog/`。

运行测试（单次运行）：

```bash
npm test
```

持续测试：

```bash
npm run test:watch
```

独立类型检查：

```bash
npm run typecheck
```

构建生产版本（包含类型检查，输出 `dist/`）：

```bash
npm run build
```

曲库相关回归测试：

```bash
npm test -- src/features/song-catalog/songCatalog.test.jsx
```

预览生产产物：

```bash
npm run preview
```

预览地址为 `http://localhost:4173/creatl-s-blog/`。可用 `-- --port 4174` 更换端口。

`npm run check` 顺序执行类型检查、全部测试和生产构建。

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写 `VITE_UI_THEME` 和 `VITE_GA_TRACK_ID`。旧配置 `REACT_APP_UI_THEME`、`REACT_APP_GA_TRACK_ID` 分别改为以上名称，保留原值。迁移后的配置应保存到忽略提交的 `.env.local`；原 `.env` 不必改动。为兼容已有部署，Vite 配置仅为这两个公开设置保留旧名回退，新名优先；新环境请使用新名。`VITE_*` 会编译到浏览器代码，只能放公开配置，不能放密钥。GitHub Actions 中可在构建步骤的 `env` 中提供同名变量，然后重新构建。

## TypeScript 范围

入口、路由、主题、页面、SafeImage、首页目录、曲库页面与游戏配置、歌曲/谱面模型、远端数据适配、筛选排序、抽谱面和本地历史使用 `.ts` / `.tsx`，启用 `strict`。远端 JSON 在适配边界按 `unknown` 校验。其余展示组件与现有测试保留 `.jsx` / `.js`，通过 `allowJs` 渐进迁移，未启用 `checkJs`；历史 `src/archive/song-catalog/` 不参与类型检查。测试随新界面调整定位方式，继续验证现有功能与统计事件。

## 主题与页面约定

默认主题 ID 为 `creatl-brand`，由根节点的 `data-ui-theme` 和 Ant Design ConfigProvider 共同生效。局部样式消费 `--brand-background`、`--brand-surface`、`--brand-text`、`--brand-muted`、`--brand-line`、`--brand-accent`、`--brand-accent-text`、`--brand-leaf`、`--brand-radius`；页面继续通过 `ResponsiveLayout` 的 `children` 接口使用公共外壳。

首页 `?folder=catalog` 与 `?folder=tools` 可直接打开对应目录，返回后恢复上层选择。`/home` 别名与曲库随机历史存储键保持兼容。比赛报名已移除，原 `/race-signon` 地址进入 404；天气模块与旧版更新记录已删除。

首页小工具目录与 `/tools` 共用 `src/data/tools.js`。小游戏「再来一脚」和「赤隼 · Roadster」通过外部链接在新标签页打开各自的 GitHub Pages 试玩页面，独立维护，不将游戏引擎和素材重复打包到本站。选曲列表的虚拟窗口跟随实际滚动位置，选中项暂未同步时仍保留可见行与可访问的当前项。

页面优先依靠标题、排列与间距说明用途，不添加机械编号、装饰状态或重复说明。保留表单标签、文章未完成状态、图片加载与失败等真实反馈。页面按钮与链接按至少 44px 触控高度设计，并尊重系统减少动态效果偏好。

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
/about         关于
*              404
```

## 维护说明

- 不要把 `.agents/`、`docs/`、`demos/` 等过程文件纳入正式提交。
- 曲库新增游戏时，优先扩展 `src/features/song-catalog/config/games.ts`，再补充对应排序、筛选和测试。
- 曲库数据适配应集中在 `normalizeSongData.ts` 与 `filterSheets.ts`，避免在 UI 组件里散落数据结构判断。
- 新工具优先加入 `src/data/tools.js`，复杂后再拆成独立 feature。
- 页面文案和源码统一使用 UTF-8。
- 修改主题或曲库后，至少运行相关测试；发布前建议运行完整测试和生产构建。

## 部署说明

- 生产站点部署在 GitHub Pages 的 `/creatl-s-blog` 子路径。
- Vite 的 `base` 为 `/creatl-s-blog/`；`BrowserRouter` 的 `basename` 为 `/creatl-s-blog`，与 `package.json` 的 `homepage` 保持一致。
- 根目录 `index.html` 是 Vite 入口，使用 `%BASE_URL%` 引用公共资源。`public/404.html` 将深链编码到根页查询参数，根入口在 React 启动前恢复路径、查询参数和 hash。Vite 开发/预览服务器自身提供 SPA fallback；实际 Pages 重定向行为还需要发布后验证。
- GitHub Actions 工作流位于 `.github/workflows/static.yml`，保留 `master` push 和手动触发。它使用 `.nvmrc` 的 Node 22，执行 `npm ci`、类型检查、完整测试和构建，上传 `dist/` 后部署。仓库 Pages 来源应选择 GitHub Actions。
- 本地验证完成后，由维护者审查并提交、推送到 `master`，等待 Pages workflow 成功，再检查线上首页、曲库、随机图片与深链刷新。迁移本身不自动推送或发布；本地预览通过不代表线上部署已成功。

## License

当前仓库尚未添加独立 License 文件。
