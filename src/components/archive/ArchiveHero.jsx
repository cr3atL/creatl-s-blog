import BrandLogo from '../brand/BrandLogo';
import SocialLinks from './SocialLinks';

export default function ArchiveHero({ socialLinks }) {
  return <section className="archive-hero" aria-labelledby="archive-hero-title">
    <BrandLogo className="archive-hero__logo" />
    <h1 id="archive-hero-title">桔子酱 / creatL</h1>
    <p className="archive-hero__intro">喜欢音游和赛车。<br />正在研究如何使用CODEX做些小东西，<br className="home-intro-break" />在这里整理音游曲库、项目和个人记录。</p>
    <SocialLinks links={socialLinks} className="archive-hero__social" />
  </section>;
}
