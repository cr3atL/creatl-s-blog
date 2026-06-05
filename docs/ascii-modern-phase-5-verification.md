# ASCII Modern 阶段 5 验收记录

## 实施范围

- 删除已确认未被活动路由引用的旧视觉代码 `src/components/ParticleCanvas.js`。
- 更新 README，补充 ASCII Modern 主题架构、维护规则和验证命令。
- 执行最终回归测试、生产构建、GitHub Pages 资源路径检查和浏览器路由回归。
- 未修改路由、导航、analytics、页面业务逻辑、GitHub Pages basename 或部署工作流。

## 清理说明

- `ParticleCanvas` 在阶段 2 和阶段 5 均经引用搜索确认未被活动页面或组件使用。
- 新背景氛围由 `src/components/ambient/AmbientCanvas.js` 提供，具备 reduced motion、页面隐藏暂停、DPR 上限和卸载清理。
- `SafeImage`、`Sidebar`、`ArticleCard` 等其他疑似未使用文件未在本阶段删除，避免扩大清理范围。

## 验证结果

- 测试：7 个测试套件、37 个测试全部通过。
- 生产构建：构建成功，且无编译 warning。
- 构建日志确认站点托管路径为 `/creatl-s-blog/`。
- `build/asset-manifest.json` 中 `main.css`、`main.js`、`index.html` 和静态资源路径均带 `/creatl-s-blog/` 前缀。
- 源码、文档和 README 均通过严格 UTF-8 检查。
- 浏览器路由回归：
  - `ascii-modern` 下 `/`、`/home`、`/about`、`/article`、`/tools`、
    `/randomssiba`、`/race-signon` 和未知路由均渲染预期主标题。
  - `ascii-modern` 下每个页面均只有一个 `.ambient-canvas`。
- `StationWeather` 只出现在首页。
- `legacy` 下首页不渲染 AmbientCanvas，也不渲染 StationWeather。
- `legacy` 仅作为关闭新主题组件和 Ant Design 主题的回滚入口，不再承诺恢复早期图片背景外观。
- 未观察到浏览器控制台错误或警告。

## 剩余风险

- 当前工作树中 `src/images/Background.jpg` 仍处于 tracked deletion 状态。当前代码已不再引用该资源，构建不受阻；合并前仍需要确认这个资源删除是否预期。
- 当前浏览器集成无法设置移动视口；真实移动宽度下的视觉、输入状态和 Drawer 焦点仍需要人工检查。
- GitHub Pages 深链恢复脚本对复杂查询参数的处理是既有风险，未在主题阶段中改动。
- 社交图标和 About 头像键盘可访问性是既有问题，未在本次主题专项中扩大范围修复。
