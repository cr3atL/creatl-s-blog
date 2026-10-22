import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import OSUIcon from '../../icons/OSUIcon.png';
import BiliBiliIcon from '../../icons/bilibiliIcon.ico';
import CloudmusicIcon from '../../icons/CloudmusicIcon.ico';
import QQIcon from '../../icons/QQIcon.png';
import { trackEvent } from '../../utils/analytics';

const iconRenderer = {
  github: (props) => <GithubOutlined {...props} />,
  bilibili: (props) => <img src={BiliBiliIcon} alt="bilibili" {...props} />,
  osu: (props) => <img src={OSUIcon} alt="OSU!" {...props} />,
  netease: (props) => (
    <img src={CloudmusicIcon} alt="网易云歌单" {...props} />
  ),
  qq: (props) => <img src={QQIcon} alt="QQ" {...props} />,
};

const SocialLinks = ({ links, onLinkClick, className = 'social-links' }) => {
  const handleClick = (link) => (event) => {
    event.preventDefault();
    trackEvent('Social_Media', 'Click', link.platform);
    if (onLinkClick) {
      onLinkClick(link);
    } else {
      window.open(link.url, '_blank');
    }
  };

  return (
    <div className={className}>
      {links.map((link) => {
        const Icon = iconRenderer[link.key] || iconRenderer.github;
        return (
          <button
            key={link.key}
            type="button"
            onClick={handleClick(link)}
            title={link.title}
            aria-label={link.label}
            className="social-link-button"
          >
            <Icon className="social-link-icon" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};

export default SocialLinks;
