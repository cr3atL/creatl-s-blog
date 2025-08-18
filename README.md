# creatL's Blog

一个基于React和Ant Design构建的个人博客系统，具有现代化的UI设计和流畅的用户体验。

## 🚀 项目特性

- **现代化UI设计**: 使用Ant Design组件库，配合毛玻璃效果和粒子动画背景
- **响应式布局**: 适配不同屏幕尺寸的设备
- **多页面支持**: 包含首页、文章列表、关于页面
- **GitHub Pages部署**: 通过GitHub Actions自动化部署
- **React Router**: 实现客户端路由导航

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
│   └── About.js       # 关于页面
├── assets/            # 静态资源
├── images/            # 图片资源
│   └── Background.jpg # 背景图片
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

## 📧 联系方式

- **邮箱**: 1439676150@qq.com
- **GitHub**: [https://github.com/cr3atL](https://github.com/cr3atL)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！
