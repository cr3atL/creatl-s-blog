import { Typography, Avatar, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import OSUIcon from '../icons/OSUIcon.png';
import BiliBiliIcon from '../icons/bilibiliIcon.ico';
import CloudmusicIcon from '../icons/CloudmusicIcon.ico';
import { trackEvent } from '../utils/analytics';

const avatarImage = 'https://github.com/cr3atL.png';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleIconClick = (url, platform) => {
    trackEvent('Social_Media', 'Click', platform);
    window.open(url, '_blank');
  };

  const handleToolClick = (path, label) => {
    trackEvent('Navigation', 'Click', label);
    navigate(path);
  };

  return (
    <ResponsiveLayout>
      <div className="page-container">
        <section className="page-hero">
          <Avatar src={avatarImage} size={72} className="page-heading-avatar" />
          <div className="page-hero-content">
            <div className="page-eyebrow">个人主页 + 工具站</div>
            <Title level={2}>creatL 的小站</Title>
            <Paragraph className="page-intro">
              这里会放一些个人内容、文章和随手做的小工具。旧曲库页面已经从活动入口下线，
              之后会用更清晰的结构重新设计。
            </Paragraph>
            <div className="social-links">
              <GithubOutlined
                className="social-link-icon"
                onClick={() => handleIconClick('https://github.com/cr3atL', 'GitHub')}
                title="GitHub"
              />
              <img
                src={BiliBiliIcon}
                alt="bilibili"
                className="social-link-icon"
                onClick={() =>
                  handleIconClick(
                    'https://space.bilibili.com/401366615?spm_id_from=333.1007.0.0/',
                    'Bilibili'
                  )
                }
                title="bilibili 主页"
              />
              <img
                src={OSUIcon}
                alt="OSU!"
                className="social-link-icon"
                onClick={() =>
                  handleIconClick('https://osu.ppy.sh/users/24792120', 'OSU')
                }
                title="OSU! 主页"
              />
              <img
                src={CloudmusicIcon}
                alt="网易云歌单"
                className="social-link-icon"
                onClick={() =>
                  handleIconClick(
                    'https://music.163.com/playlist?id=12625543271&uct2=U2FsdGVkX1+cyjQGLYDuxxrxXWCr+2t5vb0lSKRkye4=',
                    'Netease_Music'
                  )
                }
                title="网易云歌单"
              />
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="page-section-header">
            <Title level={3}>关于我</Title>
            <Paragraph className="page-body-text">
              我是桔子酱 / creatL，正在学习 React 前端开发。平时喜欢 osu!mania、
              定轨音游和 trance。
            </Paragraph>
          </div>
        </section>

        <section className="page-section">
          <div className="page-section-header">
            <Title level={3}>工具入口</Title>
            <Paragraph className="page-body-text">
              当前可用的小工具集中放在工具页，首页只保留最常用的入口。
            </Paragraph>
          </div>
          <div className="page-grid page-grid--two">
            <div className="tool-card">
              <div className="tool-card-body">
                <Title level={4}>随机兔子图片</Title>
                <Paragraph className="page-body-text">
                  从本地图片集中随机抽一张兔子图片。
                </Paragraph>
              </div>
              <Button
                type="primary"
                onClick={() => handleToolClick('/randomssiba', 'Random_Image')}
              >
                打开
              </Button>
            </div>

            <div className="tool-card">
              <div className="tool-card-body">
                <Title level={4}>比赛报名</Title>
                <Paragraph className="page-body-text">
                  一个保留中的轻量报名表单，之后可以继续完善流程。
                </Paragraph>
              </div>
              <Button
                type="primary"
                onClick={() => handleToolClick('/race-signon', 'Race_Signon')}
              >
                打开
              </Button>
            </div>
          </div>
        </section>

        <section className="page-section">
          <Title level={3}>最新动态</Title>
          <Paragraph className="page-body-text">
            小站正在整理中。文章、工具和个人信息会逐步补齐。如果你有好玩的想法，
            或者发现了需要修复的问题，可以在关于页面找到我的联系方式。
          </Paragraph>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Home;
