# creatL's Site

creatL 的个人主页 + 工具站。这个项目用于展示个人信息、文章入口，以及一些轻量小工具。旧版音乐游戏曲库已经从活动页面下线，代码被归档为参考，之后会用更清晰的结构重新设计。

在线预览：[https://cr3atl.github.io/creatl-s-blog](https://cr3atl.github.io/creatl-s-blog)

## 项目状态

当前版本已完成从“音乐游戏曲库站”到“个人主页 + 工具站”的第一轮重构：

- 活动导航和路由已聚焦于首页、文章、工具与关于页。
- 原有 CHUNITHM、SOUND VOLTEX 和 maimai 曲库已下线并归档。
- 活动页面已统一布局和中文文案。
- 旧曲库路径及未知路径统一进入 404 页面。

## 当前功能

- **首页**：个人简介、社交入口、常用工具入口和最新动态。
- **文章**：轻量文章列表，后续可继续扩展详情页、标签和归档。
- **工具页**：集中展示当前可用和未来计划中的小工具。
- **随机兔子图片**：从本地图片集中随机展示一张图片，并支持下载。
- **比赛报名**：保留中的轻量报名表单，后续可补齐提交和确认流程。
- **关于页**：个人资料、兴趣标签和联系方式。
- **GitHub Pages 部署**：支持 SPA 深链刷新和 404 fallback。
- **ASCII Modern 主题**：新增低对比 ASCII 氛围、站内虚构天气和克制的页面级视觉系统。

## 技术栈

- React 19
- React Router DOM 7
- Ant Design 5
- Create React App / react-scripts
- GitHub Pages + GitHub Actions
- Jest + React Testing Library

## 项目结构

```txt
src/
├── Page/                    # 活动页面
│   ├── Home.js              # 首页
│   ├── Article.js           # 文章列表
│   ├── Tools.js             # 工具集合页
│   ├── Randomssiba.js       # 随机兔子图片工具
│   ├── RaceSignon.js        # 比赛报名工具
│   ├── About.js             # 关于页
│   └── NotFound.js          # 404 页面
├── archive/
│   └── song-catalog/        # 旧曲库实现归档，仅作未来重做参考
├── components/              # 布局和通用组件
│   └── ambient/             # ASCII 氛围和站内状态组件
├── hooks/                   # 主题相关 hook 和通用交互 hook
├── icons/                   # 图标资源
├── images/                  # 可选图片资源
├── ssiba/                   # 随机图片素材
├── styles/                  # 全局样式和页面样式
└── utils/                   # 通用工具函数
```

## 旧曲库归档

旧版 CHUNITHM、SOUND VOLTEX 和 maimai 曲库页面已从 active app 中移除。相关代码保存在：

```txt
src/archive/song-catalog/
```

这些文件只作为未来重做曲库时的参考，不建议直接恢复到路由中。未来曲库应优先采用配置驱动、统一页面壳和更清晰的数据适配层。

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

构建生产版本：

```bash
npm run build
```

运行测试：

```bash
npm test -- --watchAll=false
```

提交改动前建议依次运行：

```bash
npm test -- --watchAll=false
npm run build
```

## 路由

```txt
/              首页
/home          首页别名
/article       文章
/tools         工具
/randomssiba   随机兔子图片
/race-signon   比赛报名
/about         关于
*              404
```

旧曲库路径现在会进入 404：

```txt
/chunithm-songs
/sdvx-songs
/maimai-songs
```

## 维护说明

- 不要从 `src/archive/song-catalog/` 直接 import 代码到 active app。
- 新工具优先加入 `src/Page/Tools.js`，再视复杂度拆成独立 feature。
- 页面文案和源码统一使用 UTF-8。
- 大体量静态素材后续建议迁到 `public/`、对象存储或 CDN，并用 manifest 管理。

## ASCII Modern 主题维护

- 主题入口在 `src/index.js`，默认使用 `ascii-modern`，可通过
  `REACT_APP_UI_THEME=legacy|ascii-modern` 和 `?ui=legacy|ascii-modern` 控制。
- `legacy` 仅用于关闭 ASCII Modern 的 Ant Design 主题、AmbientCanvas 和 StationWeather，
  不承诺恢复早期图片背景外观。
- 新增的主题专属样式应继续限定在 `[data-ui-theme="ascii-modern"]` 下，避免继续扩大 legacy 和新主题之间的耦合。
- Ant Design 主题令牌集中在 `src/theme/uiTheme.js`，页面样式优先通过
  `src/styles/tokens.css` 的变量扩展，不要在页面里散落硬编码颜色。
- 全局 shell 与背景氛围由 `src/components/AppShell.js` 接入：
  - `src/components/ambient/AmbientCanvas.js` 只负责低对比背景，不包含路由或业务逻辑。
  - Canvas 必须保持 `pointer-events: none`、`aria-hidden="true"`、DPR 上限、reduced motion、隐藏页面暂停和卸载清理。
- 首页站内天气由 `src/components/ambient/StationWeather.js`、`src/hooks/useStationWeather.js`
  和 `src/utils/stationWeather.js` 组成。天气是 `CreatL Station` 的确定性虚构内部气候，不允许接入真实天气 API、访客定位或 IP 推断。
- 页面级视觉应保持当前分层：Home 可以更有表现力；Tools、Article、Random Image、Race Sign-on 保持克制；Not Found 可以使用更强 ASCII 状态。
- 不要为了主题工作改动路由、`basename="/creatl-s-blog"`、analytics 事件名、工具业务逻辑、表单字段或 GitHub Pages 部署脚本。
- 删除旧视觉资源前必须先确认没有活动源码引用，并在验收记录中说明删除原因；归档曲库仍引用的共享工具不要混入主题清理。
- 修改主题后至少运行：

```bash
npm test -- --watchAll=false --runInBand
npm run build
```

- 真实移动视口仍需要人工检查，重点看 `576px` 页面断点和 `768px` shell 断点附近。

## 部署说明

- 生产站点部署在 GitHub Pages 的 `/creatl-s-blog` 子路径。
- `BrowserRouter` 的 `basename` 与 `package.json` 中的 `homepage` 必须保持一致。
- `public/404.html` 与 `public/index.html` 中的重定向脚本用于支持 SPA 深链刷新。
- GitHub Actions 工作流位于 `.github/workflows/static.yml`。

## License

当前仓库尚未添加独立的 License 文件。
