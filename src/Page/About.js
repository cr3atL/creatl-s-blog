import { Typography, Avatar, Space, Tag, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import QQIcon from '../icons/QQIcon.png';

const avatarImage = 'https://github.com/cr3atL.png';

const { Title, Paragraph } = Typography;

const About = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isHovered, setIsHovered] = useState(false);

  const handleAvatarClick = () => {
    messageApi.error('不准摸！');
  };

  return (
    <>
      {contextHolder}
      <ResponsiveLayout>
        <div className="page-container page-container--narrow about-page">
          <section className="page-hero profile-card about-hero">
            <Avatar
              size={112}
              src={avatarImage}
              onClick={handleAvatarClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`about-avatar${isHovered ? ' about-avatar--hovered' : ''}`}
            />
            <div className="page-hero-content">
              <div className="page-eyebrow">About</div>
              <Title level={2}>CreatL</Title>
              <Paragraph type="secondary">桔子酱 | cr3atL</Paragraph>
              {isHovered && (
                <Paragraph className="about-avatar-hint">
                  点击就可以摸摸桔子酱！
                </Paragraph>
              )}
              <Paragraph className="page-body-text">
                你好，我是桔子酱。喜欢 osu!mania，也在学习前端开发。
              </Paragraph>
            </div>
          </section>

          <section className="page-section about-tags">
            <Title level={3}>兴趣和技能</Title>
            <Space size={[8, 12]} wrap>
              <Tag color="blue">OSU!Mania</Tag>
              <Tag color="cyan">React</Tag>
              <Tag color="green">前端开发</Tag>
              <Tag color="purple">Trance</Tag>
            </Space>
          </section>

          <section className="page-section about-contact">
            <Title level={3}>联系方式</Title>
            <div className="contact-row">
              <img src={QQIcon} alt="QQ" className="contact-icon" />
              <a href="https://qm.qq.com/q/MFdHgohGqm">点击添加我的 QQ</a>
            </div>
            <div className="contact-row">
              <GithubOutlined />
              <strong>GitHub:</strong>
              <a href="https://github.com/cr3atL" target="_blank" rel="noreferrer">
                cr3atL
              </a>
            </div>
            <div className="contact-row">
              <strong>个人网站:</strong>
              <span>目前就是这个小站。</span>
            </div>
          </section>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default About;
