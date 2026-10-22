import ResponsiveLayout from '../components/ResponsiveLayout';
import SafeImage from '../components/SafeImage';
import socialLinks from '../data/socialLinks';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/content-pages.css';
import '../styles/pages/about.css';

export default function About() {
  return <ResponsiveLayout>
    <div className="content-page content-page--narrow about-page">
      <div className="about-intro" data-motion-section>
        <SafeImage src="https://github.com/cr3atL.png" alt="creatL 头像" className="about-avatar" />
        <div><h1>关于我</h1><p>我是桔子酱 / creatL。喜欢音游和赛车，也在学习前端开发。</p></div>
      </div>
      <dl className="about-interests" data-motion-section>
        <div><dt>正在使用</dt><dd>Codex辅助开发</dd></div>
        <div><dt>游戏兴趣</dt><dd>音游、赛车</dd></div>
      </dl>
      <section aria-labelledby="about-site-title" data-motion-section>
        <h2 id="about-site-title">这个站点</h2>
        <p>个人主页、音游曲库和一些小工具。首页采用文件夹式内容选择，曲库支持筛选、排序、谱面详情与随机抽谱面，图片工具支持随机查看和下载兔子图片。</p>
      </section>
      <section className="about-contact" aria-labelledby="about-contact-title" data-motion-section>
        <h2 id="about-contact-title">找到我</h2>
        <ul>{socialLinks.map(link => <li key={link.key}>
          <a href={link.url} onClick={event => {
            event.preventDefault();
            trackEvent('Social_Media', 'Click', link.platform);
            window.open(link.url, '_blank', 'noopener,noreferrer');
          }}>{link.label}<span aria-hidden="true">↗</span></a>
        </li>)}</ul>
      </section>
    </div>
  </ResponsiveLayout>;
}
