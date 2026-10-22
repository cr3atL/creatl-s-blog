import { Typography } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import SocialLinks from '../components/archive/SocialLinks';
import socialLinks from '../data/socialLinks';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/about.css';

const { Paragraph } = Typography;

const avatarImage = 'https://github.com/cr3atL.png';

const signals = [
  { label: 'REACT', value: '学习中' },
  { label: 'OSU!MANIA', value: '稳定游玩' },
  { label: 'GENRE', value: 'trance' },
  { label: 'ROLE', value: 'frontend' },
];

const About = () => {
  const handleLinkClick = (link, event) => {
    event.preventDefault();
    trackEvent('Social_Media', 'Click', link.platform);
    window.open(link.url, '_blank');
  };

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--narrow about-page">
        <section
          className="about-hero"
          aria-labelledby="about-hero-title"
        >
          <img
            src={avatarImage}
            alt="creatL 头像"
            className="about-hero__avatar"
          />
          <div className="about-hero__body">
            <span className="about-hero__eyebrow">04 / ABOUT</span>
            <h1 id="about-hero-title" className="about-hero__title">
              ABOUT / creatL
            </h1>
            <Paragraph className="about-hero__intro">
              我是桔子酱 / creatL。喜欢 osu!mania，也在学习前端开发。
              下面是我的当前状态和联系方式。
            </Paragraph>
          </div>
        </section>

        <section
          className="about-section"
          aria-labelledby="about-signals-title"
        >
          <SectionHeader
            number="04.1"
            title="CURRENT SIGNALS"
            id="about-signals-title"
          />
          <dl className="about-signals" aria-label="current signals">
            {signals.map((signal) => (
              <div key={signal.label} className="about-signals__row">
                <dt className="about-signals__label">{signal.label}</dt>
                <dd className="about-signals__value">{signal.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="about-section"
          aria-labelledby="about-contact-title"
        >
          <SectionHeader
            number="04.2"
            title="CONTACT CHANNELS"
            id="about-contact-title"
          />
          <ul className="about-contact" aria-label="contact channels">
            {socialLinks.map((link) => (
              <li key={link.key} className="contact-row">
                <a
                  href={link.url}
                  onClick={(event) => handleLinkClick(link, event)}
                  className="contact-row__link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="about-contact__social">
            <span className="about-contact__social-label">SHORTCUTS</span>
            <SocialLinks links={socialLinks} />
          </div>
          <p className="about-personal-site">
            <span className="about-personal-site__label">个人网站:</span>
            <span>目前就是这个小站。</span>
          </p>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default About;
