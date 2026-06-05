# ASCII Modern 阶段 3 验收记录

## 实施范围

- 新增确定性的 `CreatL Station` 站内虚构天气生成器。
- 新增 `useStationWeather` 和 `useStationClock`。
- 新增首页专用的 `StationWeather` 组件。
- 仅调整 Home 首屏 hero，把新主题下的天气面板放到右侧。
- `legacy` 主题下不渲染天气面板，保留回滚外观。
- 未修改路由、导航、工具按钮目标、analytics 事件名、其他页面业务逻辑或 GitHub Pages 部署配置。

## 天气规则

- 固定站点时区：`Asia/Shanghai`。
- 不调用真实天气 API。
- 不读取访客定位、IP 或浏览器地理位置。
- 同一站点日期下预报稳定。
- `stationWeather` 是纯函数，便于直接测试。
- offset 会先创建真实偏移后的 `Date`，再生成站点日期键。
- 已覆盖跨月、跨年和闰年日期偏移。

## 验证结果

- 测试：7 个测试套件、32 个测试全部通过。
- 生产构建：构建成功。
- 构建资源基路径仍为 `/creatl-s-blog/`。
- 阶段 3 最终构建相较阶段 2 最终构建约增加 1.42 kB gzip JavaScript，
  约增加 321 B gzip CSS。
- 所有本阶段新增和修改的源码文件均通过严格 UTF-8 检查。
- 浏览器验证：
  - `ascii-modern` 首页显示 `CreatL Station`。
  - 天气面板明确标注为站内虚构预报，不使用访客定位或真实天气接口。
  - `legacy` 首页不渲染天气面板，也不渲染新主题专用的 `home-hero__identity` 包装层。
  - 首页工具按钮仍可导航到 `/randomssiba`。
  - 未观察到浏览器控制台错误或警告。

## 验收后定向修正

- 已移除 `AppShell` 中的原图背景引用，`.shell-background` 不再使用 `Background.jpg`。
- 已删除不再引用的旧背景图资源。
- 默认主题已切换为 `ascii-modern`，仍可通过 `?ui=legacy` 回滚。
- `AmbientCanvas` 已改为参考 demo 的 ASCII 海洋字符场：上方留暗色空间，下方以 `#`、`~`、`.` 等字符绘制海面。
- Canvas 仍保留阶段 2 的工程护栏：DPR 上限、字符数量上限、reduced motion 静态帧、隐藏页暂停和卸载清理。
- `StationWeather` 已从普通信息卡改为 demo 风格的 terminal/weather 输出：命令行、ASCII 横线、左右边框、温度突出、Wind/Humidity/Signal 右侧读数、底部 origin。
- 浏览器复验确认：
  - `.shell-background` 的 `background-image` 为 `none`。
  - `ascii-modern` 下存在一个 `.ambient-canvas`，透明度为 `0.32`。
  - 天气面板显示 `weather --station creatl --live`。
  - 天气面板显示 `CREATL STATION / GENERATED INTERNAL CLIMATE`。

## 剩余人工风险

- 当前浏览器集成无法设置移动视口。Home hero 的移动端堆叠样式已有 CSS 规则，但仍需要真实移动宽度下的人工视觉检查。
