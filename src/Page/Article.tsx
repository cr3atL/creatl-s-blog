import { Button, message } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/content-pages.css';
import '../styles/pages/article.css';

const articles = [{
  id: 'site-brand-refresh', title: '个人站重构：品牌与选曲界面',
  summary: '从 Logo 的奶油白与橙色出发，重新整理首页、音游曲库和工具入口。', date: '2026-10-22',
  content: [
    '站点已迁移到 Vite、React 和 TypeScript，页面按路由加载，继续支持 GitHub Pages 的子路径和深层链接。',
    '首页将个人介绍与文件夹式目录并排展示，进入目录后只保留当前层内容。音游曲库默认使用紧凑选曲列表，支持键盘选择、筛选排序、谱面详情和随机抽谱面历史，也保留网格、详情列表与摘要视图。',
  ],
}, {
  id: 'osu-mania-how-to-play', title: 'Osu!mania 怎么玩',
  summary: '随手写一点入门体验和个人理解。', date: '2025-08-19',
}];

export default function Article() {
  const [messageApi, contextHolder] = message.useMessage();
  return <ResponsiveLayout>
    {contextHolder}
    <div className="content-page article-page">
      <h1 data-motion-section>文章与记录</h1>
      {articles.length === 0 ? <p role="status">暂时没有文章。</p> :
        <ul className="article-feed">
          {articles.map(article => <li key={article.id} className="article-feed__entry" data-motion-section>
            <time dateTime={article.date}>{article.date.replaceAll('-', '.')}</time>
            <div className="article-feed__body">
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              {article.content ? <div className="article-feed__content">{article.content.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div> :
                <span className="article-feed__unfinished">尚未完成，暂无全文</span>}
            </div>
            {!article.content && <Button onClick={() => {
              trackEvent('Article', 'Click', article.id);
              messageApi.info('这篇还没写完 >_<');
            }} aria-label={`查看进度 ${article.title}`}>查看进度</Button>}
          </li>)}
        </ul>}
    </div>
  </ResponsiveLayout>;
}
