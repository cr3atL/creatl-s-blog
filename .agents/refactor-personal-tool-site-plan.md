# 个人主页 + 工具站重构计划

## 背景

当前项目名义上是个人博客，但实际更接近「个人主页 + 工具站」。现有三个曲库页面功能较重、重复较多，并且后续计划重新设计，因此本轮重构目标不是继续维护曲库，而是先把主站结构稳定下来。

本计划用于新对话中实施。实施时建议继续使用 subagent，先分工勘察和拆除影响面，再由主 agent 汇总、改动、验证。

## 本轮目标

1. 将项目定位调整为个人主页 + 工具站。
2. 结构性下线三个曲库页面：
   - `/chunithm-songs`
   - `/sdvx-songs`
   - `/maimai-songs`
3. 清理导航和首页曲库入口。
4. 保留未来工具站扩展空间，例如 `/tools` 或首页工具区。
5. 优先修复全局文案乱码、导航拥挤、页面骨架不统一的问题。
6. 不在本轮重做曲库，不引入复杂后台，不做大规模技术栈迁移。

## 非目标

本轮暂不做：

- 新曲库实现。
- 后台管理系统。
- 登录、权限、数据库。
- 完整文章 CMS。
- 大规模迁移到 Vite、Next.js 或 TypeScript 全量重构。
- 删除所有旧曲库代码的不可逆清理，除非用户明确要求。

## 推荐策略

采用「主应用下线 + 旧代码归档」策略。

主应用中完全移除曲库入口和路由，但旧曲库代码先移动到归档目录或保留为未引用模块，方便以后参考。

推荐归档路径：

```txt
src/archive/song-catalog/
```

如果实施时发现移动文件会引入大量 import 断裂或构建风险，可以先选择更保守的方式：

- 删除路由引用。
- 删除导航入口。
- 删除首页入口。
- 保留旧文件在原位置，但确保主应用不再 import。

## 建议新信息架构

一级结构：

- 首页：个人介绍、最近动态、常用入口。
- 文章：文章列表，后续可扩展详情、标签、归档。
- 工具：随机图片、比赛报名、未来新工具入口。
- 关于：联系方式、个人资料。
- 404：统一风格错误页。

可选路由：

```txt
/              首页
/home          首页别名，可保留或重定向
/article       文章列表
/tools         工具集合页
/randomssiba   随机图片工具，也可后续迁到 /tools/random-image
/race-signon   比赛报名工具，也可后续迁到 /tools/race-signon
/about         关于
*              404
```

## Subagent 分工建议

### Agent A：路由与引用影响面

任务：

- 只读扫描所有曲库页面相关引用。
- 找出需要从 `App.js`、导航、首页、测试中删除或调整的引用。
- 输出可能受影响文件清单。

关注文件：

```txt
src/App.js
src/components/navItems.js
src/Page/Home.js
src/App.test.js
README.md
```

输出格式：

- 当前曲库路由在哪里注册。
- 当前曲库入口在哪里展示。
- 删除入口后哪些 import 会变成无用。
- 是否存在测试依赖这些文案或路由。

### Agent B：页面骨架与视觉统一

任务：

- 只读扫描布局组件和页面样式。
- 给出首页、工具页、关于页、文章页的统一页面骨架建议。
- 指出乱码文案和不统一样式位置。

关注文件：

```txt
src/components/AppShell.js
src/components/Layout.js
src/components/MobileLayout.js
src/components/ResponsiveLayout.js
src/components/navItems.js
src/styles/tokens.css
src/styles/shell.css
src/styles/page.css
src/styles/responsive.css
```

输出格式：

- 全局布局问题。
- 导航调整建议。
- 页面容器/标题/卡片统一建议。
- 移动端 Drawer 和桌面导航建议。

### Agent C：归档与删除策略

任务：

- 只读梳理曲库相关文件，区分「只属于曲库」和「可能仍可复用」。
- 设计归档或删除方案。

只属于曲库的候选：

```txt
src/Page/ChunithmSongs.js
src/Page/SdvxSongs.js
src/Page/MaimaiSongs.js
src/components/MaimaiFilter.js
src/components/SongFilterModal.js
src/components/NoteDetailModal.js
src/hooks/useSongFilters.js
src/config/songFilterConfigs.js
src/utils/maimaiData.js
src/utils/maimaiFilters.js
src/utils/genericSongFilters.js
src/types/maimai.ts
src/styles/song-pages.css
```

可能仍可复用：

```txt
src/components/SafeImage.js
src/utils/random.js
```

输出格式：

- 建议归档文件列表。
- 建议保留文件列表。
- 如果不归档，仅主应用下线，需要改哪些 import。

## 阶段计划

### Phase 0：保护现场

目标：确认工作区状态，避免误删用户已有改动。

步骤：

1. 查看 `git status --short`。
2. 记录当前未提交文件。
3. 不执行 `git reset`、`git checkout --` 等破坏性命令。
4. 如果发现大量未提交改动，先向用户确认哪些需要保留。

验收：

- 明确当前变更归属。
- 没有覆盖用户改动。

### Phase 1：下线曲库入口

目标：主应用不再暴露三个曲库页面。

步骤：

1. 从 `src/App.js` 移除三个曲库页面 import 和 route。
2. 从 `src/components/navItems.js` 移除三个曲库导航项。
3. 从 `src/Page/Home.js` 移除三个曲库功能卡和对应跳转函数。
4. 如有测试依赖曲库入口，调整测试。

验收：

- 导航中不再出现 CHUNITHM、SDVX、maimai。
- 首页不再出现曲库功能卡。
- 访问旧曲库路径进入 404。
- 构建不因无用 import 或语法错误失败。

### Phase 2：建立工具站入口

目标：曲库下线后，项目仍有明确的工具站扩展位置。

建议方案：

1. 新增 `/tools` 工具集合页。
2. 工具页展示当前可用工具：
   - 随机图片。
   - 比赛报名。
3. 首页只放精选入口，不堆全部内容。
4. 导航新增「工具」入口。

可选：

- 保留 `/randomssiba` 和 `/race-signon` 原路径。
- 后续再迁移到 `/tools/random-image`、`/tools/race-signon`。

验收：

- 用户能从导航进入工具集合。
- 工具集合能跳转到现有工具。
- 首页结构更像个人主页，而不是功能堆叠页。

### Phase 3：修复文案乱码

目标：先让项目可读，再谈进一步设计。

重点位置：

```txt
src/App.js
src/components/navItems.js
src/components/AppShell.js
src/components/MobileLayout.js
src/components/ResponsiveLayout.js
src/Page/Home.js
src/Page/Article.js
src/Page/About.js
src/Page/Randomssiba.js
src/Page/RaceSignon.js
src/Page/NotFound.js
src/components/SongFilterModal.js
src/components/MaimaiFilter.js
src/components/NoteDetailModal.js
```

本轮主应用至少要修：

```txt
src/components/navItems.js
src/components/AppShell.js
src/components/MobileLayout.js
src/components/ResponsiveLayout.js
src/Page/Home.js
src/Page/Article.js
src/Page/About.js
src/Page/Randomssiba.js
src/Page/RaceSignon.js
src/Page/NotFound.js
```

验收：

- 导航、按钮、页面标题、提示文案不再乱码。
- Footer 年份和版权文案正常。
- 源码保存为 UTF-8。

### Phase 4：统一页面骨架和视觉

目标：降低视觉噪音，建立个人主页 + 工具站的统一页面体验。

建议：

1. 保留背景图作为氛围，但降低内容区透明度和阴影复杂度。
2. 保留少量个人特色动效，但正文页不要过度动效。
3. 所有普通页面统一使用：
   - `page-container`
   - `page-container--narrow`
   - `page-container--medium`
   - `section-stack`
   - `page-card-spaced`
4. 移动端 Drawer 宽度调整为 `min(320px, 86vw)`。
5. 导航标签尽量短：
   - 首页
   - 文章
   - 工具
   - 关于

验收：

- 首页、文章、工具、关于、随机图片、报名、404 的布局节奏一致。
- 移动端导航不拥挤。
- 页面内容可读性明显提升。

### Phase 5：归档旧曲库代码

目标：主应用轻量化，同时保留未来重做参考。

推荐做法：

1. 创建：

```txt
src/archive/song-catalog/
```

2. 将曲库页面、筛选器、曲库 utils、曲库样式移入归档目录。
3. 确保归档代码不被主应用 import。
4. 在归档目录增加简短说明：

```txt
src/archive/song-catalog/README.md
```

说明内容：

- 这些是旧曲库实现。
- 当前主应用已下线。
- 未来重做时只作为参考，不建议直接恢复。

验收：

- 主应用不引用归档目录。
- 构建通过。
- 旧代码没有丢失。

## 建议实施顺序

推荐顺序：

1. Phase 0：保护现场。
2. Phase 1：下线曲库入口。
3. Phase 2：建立工具页。
4. Phase 3：修复主应用乱码。
5. Phase 4：统一页面骨架。
6. Phase 5：归档旧曲库代码。

如果时间有限，最小可交付版本是：

1. 下线曲库路由和导航。
2. 首页移除曲库入口。
3. 新增工具页。
4. 修复导航和首页乱码。
5. `npm run build` 通过。

## 验证清单

实施后至少执行：

```txt
npm run build
```

建议人工检查：

- `/`
- `/article`
- `/tools`
- `/randomssiba`
- `/race-signon`
- `/about`
- `/chunithm-songs`
- `/sdvx-songs`
- `/maimai-songs`
- 一个不存在的路径

期望：

- 主页面无乱码。
- 工具页可访问。
- 旧曲库路径进入 404。
- 首页没有曲库入口。
- 导航简洁。
- 移动端 Drawer 可读。

## 风险点

1. 源码乱码可能不是简单文案替换，而是历史编码保存问题；修复时要确保文件统一 UTF-8。
2. 当前工作区可能已有未提交改动，实施前必须确认。
3. 如果移动曲库文件，可能导致路径 import 断裂；建议先主应用下线，再归档。
4. `src/ssiba` 静态资源很大，本轮不强制处理，但后续应迁出源码或建立 manifest。
5. CRA + React 19 可能存在长期维护压力，但本轮不迁移工具链。

## 给新对话的建议首条指令

可以在新对话中这样开始：

```txt
请阅读 .agents/refactor-personal-tool-site-plan.md，并按计划执行。先使用 subagent 分别检查路由引用、页面布局、曲库归档影响面；主 agent 汇总后实施 Phase 1 到 Phase 3，先不要做大规模工具链迁移。实施时不要覆盖未确认的用户改动，完成后运行 npm run build 验证。
```

