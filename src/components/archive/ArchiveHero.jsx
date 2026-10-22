import React from 'react';
import { Typography } from 'antd';
import SocialLinks from './SocialLinks';
import StationWeather from '../ambient/StationWeather';

const { Title, Paragraph } = Typography;

// Archive Terminal 首页 Hero
// 左侧为个人档案入口（无头像），右侧为 StationWeather 视觉锚点。
// statusLine 显示档案站当前状态。
const ArchiveHero = ({ socialLinks }) => {
  return (
    <section
      className="archive-hero"
      aria-labelledby="archive-hero-title"
    >
      <div className="archive-hero__identity">
        <div className="archive-hero__eyebrow">
          <span className="archive-hero__tag">PERSONAL ARCHIVE</span>
          <span className="archive-hero__divider">/</span>
          <span className="archive-hero__tag">TOOL STATION</span>
        </div>
        <Title level={1} id="archive-hero-title" className="archive-hero__title">
          creatL 的小站
        </Title>
        <Paragraph className="archive-hero__intro">
          这里是我的个人主页和工具站。收集了文章、随手做的小工具
          和音游曲库，简单直接。
        </Paragraph>

        <ul className="archive-hero__status" aria-label="archive station status">
          <li>
            <span className="archive-hero__status-key">[ARCHIVE]</span>
            <span className="archive-hero__status-value">online</span>
          </li>
          <li>
            <span className="archive-hero__status-key">[TOOLS]</span>
            <span className="archive-hero__status-value">available</span>
          </li>
          <li>
            <span className="archive-hero__status-key">[SIGNAL]</span>
            <span className="archive-hero__status-value">stable</span>
          </li>
        </ul>

        <SocialLinks links={socialLinks} className="archive-hero__social" />
      </div>

      <div className="archive-hero__weather">
        <StationWeather />
      </div>
    </section>
  );
};

export default ArchiveHero;
