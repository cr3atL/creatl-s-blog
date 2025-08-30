# creatL's Blog

一个基于React和Ant Design构建的个人博客系统，具有现代化的UI设计和流畅的用户体验。

## 🚀 项目特性

- **现代化UI设计**: 使用Ant Design组件库，配合毛玻璃效果和粒子动画背景
- **响应式布局**: 适配不同屏幕尺寸的设备
- **多页面支持**: 包含首页、文章列表、关于页面、随机兔子图片页面
- **GitHub Pages部署**: 通过GitHub Actions自动化部署
- **React Router**: 实现客户端路由导航
- **动态内容**: 随机兔子图片展示功能
- **社交链接**: 集成GitHub、Bilibili、OSU等社交平台链接

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **UI组件库**: Ant Design 5.27.0
- **路由管理**: React Router DOM 7.8.1
- **构建工具**: Create React App (react-scripts 5.0.1)
- **部署工具**: GitHub Pages + GitHub Actions
- **开发工具**: ESLint, Jest, React Testing Library

## 📁 项目结构

```
src/
├── components/          # 公共组件
│   ├── Layout.js      # 布局组件（包含导航和背景）
│   ├── ArticleCard.js # 文章卡片组件
│   ├── Sidebar.js     # 侧边栏组件
│   └── ParticleCanvas.js # 粒子动画组件
├── Page/              # 页面组件
│   ├── Home.js        # 首页
│   ├── Article.js     # 文章列表页
│   ├── About.js       # 关于页面
│   └── Randomssiba.js # 随机兔子图片页面
├── assets/            # 静态资源
├── icons/             # 图标资源
│   ├── OSUIcon.png    # OSU图标
│   ├── QQIcon.png     # QQ图标
│   └── bilibiliIcon.ico # Bilibili图标
├── images/            # 图片资源
│   └── Background.jpg # 背景图片
├── ssiba/             # 兔子图片资源目录
├── styles/            # 样式文件
└── utils/             # 工具函数
```

## 🎯 主要功能

### 首页
- 个人介绍和头像展示
- 文章分类卡片导航
- 最新动态展示
- 响应式卡片布局

### 文章页面
- 文章列表展示
- 文章摘要和标签
- 阅读时间统计
- 文章详情页面（开发中）

### 关于页面
- 个人信息展示
- 技能标签云
- 联系方式
- 社交媒体链接
- QQ、GitHub、Bilibili、OSU等平台链接

### 随机兔子页面
- 随机展示兔子图片
- 动态加载效果
- 一键切换图片功能
- 支持多种图片格式（PNG、JPG、GIF）

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm start
```
访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本
```bash
npm run build
```

### 部署到GitHub Pages
```bash
npm run deploy
```

## 📝 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm test` - 运行测试
- `npm run deploy` - 部署到GitHub Pages
- `npm run eject` - 暴露配置文件（不可逆操作）

## 🌐 在线预览

项目已部署到GitHub Pages：[https://cr3atl.github.io/creatl-s-blog](https://cr3atl.github.io/creatl-s-blog)

## 🔄 自动化部署

项目使用GitHub Actions实现自动化部署：
- 推送到master分支自动触发构建
- 自动部署到GitHub Pages
- 支持手动触发部署

## 🎨 设计特色

- **毛玻璃效果**: 使用backdrop-filter实现现代化的毛玻璃UI
- **粒子动画背景**: 动态粒子效果增强视觉体验
- **渐变文字**: 标题使用CSS渐变和动画效果
- **阴影效果**: 多层阴影营造立体感
- **响应式设计**: 适配移动端和桌面端
- **交互动画**: 图标悬停效果和图片加载动画
- **个性化图标**: 自定义OSU、QQ、Bilibili等平台图标

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📝 更新日志

### v1.3.0 (2025-8-230)

- 完成了中二节奏与sdvx的曲库（数据来源于https://arcade-songs.zetaraku.dev/）
- 添加了随机歌曲的功能
- 添加了歌曲筛选/搜索的功能


### v1.2.0 (2025-8-19)
- 为手机端添加了专门适配的Layout
- 添加了一个时钟组件


### v1.1.1 (2025-8-18)
 - 随机兔子页面新增了下载按钮

### v1.1.0 (2025-08-18)
- 新增随机兔子图片页面功能
- 修复图片组件使用问题
- 完善项目文档
- 优化UI交互效果

### v1.0.0 (2025-08-18)
- 项目初始化
- 完成基础页面架构
- 实现响应式布局
- 集成GitHub Actions部署
