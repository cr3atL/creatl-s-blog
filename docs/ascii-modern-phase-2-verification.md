# ASCII Modern 阶段 2 验收记录

## 实施范围

- 新增一个可复用的 reduced motion 偏好 hook。
- 新增固定在背景层的 ASCII 氛围 Canvas。
- 仅在 `ascii-modern` 主题下通过 `AppShell` 接入 Canvas。
- 保留既有未使用的 `ParticleCanvas`，没有删除或改写它。
- 未修改路由、页面结构、业务逻辑、analytics 行为或 GitHub Pages 部署配置。

## 生命周期与性能

- 暂停和卸载时会取消 animation frame。
- 页面隐藏时暂停动画，页面重新可见时恢复。
- 用户启用 reduced motion 时只绘制静态帧，不启动持续动画。
- 卸载时移除 resize、visibility、media query 监听器。
- Canvas DPR 上限为 `2`。
- 移动宽度使用更低密度，并将字符网格严格限制在 `1800` 个字符以内。
- Canvas 字体在初始化或 resize 时缓存，不在每一帧读取计算样式。
- Canvas 设置 `aria-hidden="true"`，并通过 CSS 设置 `pointer-events: none`。

## 验证结果

- 测试：5 个测试套件、23 个测试全部通过。
- 生产构建：构建成功。
- 构建资源基路径仍为 `/creatl-s-blog/`。
- 阶段 2 最终构建相较阶段 1 最终构建约增加 977 B gzip JavaScript，
  约增加 44 B gzip CSS。
- 所有源码 JS、CSS、JSON 均通过严格 UTF-8 检查。
- 浏览器验证：
  - `ascii-modern` 下只渲染一个 `.ambient-canvas`。
  - Canvas 位于 `.shell-layout` 后方，不遮挡内容层。
  - Canvas 不拦截鼠标事件。
  - `legacy` 下不渲染 AmbientCanvas。
  - 桌面菜单导航仍可正常点击。
  - 未观察到浏览器控制台错误或警告。

## 剩余人工风险

- 当前浏览器集成无法设置移动视口。移动密度行为已有单元测试覆盖，但仍需要在真实移动宽度下做一次人工视觉检查。
