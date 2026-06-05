# ASCII Modern 阶段 0 基线记录

本记录用于阶段 1 视觉改动前后的行为对照。

## 兼容性护栏

- 路由：`/`、`/home`、`/about`、`/article`、`/tools`、`/randomssiba`、
  `/race-signon`，以及未知路由兜底页。
- GitHub Pages basename：`/creatl-s-blog`。
- 首页工具入口：保留原目的地和 analytics 事件名。
- 工具页入口：保留两个工具目的地。
- 404 页面：保留返回首页目的地。
- 部署相关文件保持不变：`package.json`、`public/404.html`、
  `public/index.html`、`.github/workflows/static.yml`。

## 编码检查

`src/` 下所有 `.js`、`.css`、`.json` 文件均通过严格 UTF-8 解码。
现有中文源码内容本身是正确的；终端乱码主要来自 Windows PowerShell
默认编码显示问题。后续编辑应继续保持 UTF-8。

## 已知基线问题

- `/home` 会渲染首页，但桌面/移动导航不会选中首页项。
- 跨越 JavaScript 控制的 `768px` 布局断点时，公共 shell 可能重新挂载。
- 现有社交图标和头像交互并不完全支持键盘操作。
- GitHub Pages 深链恢复脚本可能无法可靠保留 `?ui=...`，因为现有脚本会用
  `?` 拼接重定向后的查询片段。

## 验证记录

- 加护栏前基线测试：1 个测试套件、1 个测试通过。
- 阶段 0 加护栏后测试：2 个测试套件、12 个测试通过。
- 阶段 0 生产构建：允许构建流程替换既有 `build/` 输出后，构建成功。
  生成资源基路径仍为 `/creatl-s-blog/`。
- 阶段 1 首轮测试：2 个测试套件、12 个测试通过。
- 阶段 1 生产构建：构建成功。gzip 后 JavaScript 约增加 1.26 kB，
  CSS 约增加 880 B。
- 阶段 1 补齐主题入口测试后：3 个测试套件、16 个测试通过。
- 阶段 1 最终生产构建：构建成功，资源基路径仍为 `/creatl-s-blog/`。
- 浏览器路由检查（`?ui=ascii-modern`）：全部活动路由和未知路由兜底页都能渲染预期主标题。
- 浏览器回滚检查（`?ui=legacy`）：根节点主题标记可切回 legacy。

## 视觉验证限制

- 已在本地浏览器检查 ASCII Modern 主题下的桌面首页。
- 当前仓库和浏览器集成没有可复现的自动移动端截图能力。移动端 CSS 和既有
  `ResponsiveLayout` 行为仍需要真实移动宽度下的人工视觉确认。
