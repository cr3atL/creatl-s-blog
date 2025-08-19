import { Typography, Card, Avatar, Space, Tag, message } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { GithubOutlined } from "@ant-design/icons"
import QQIcon from '../icons/QQIcon.png';
import { useState } from 'react';




const avatarImage = 'https://github.com/cr3atL.png';

const { Title, Paragraph } = Typography;

const About = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAvatarClick = () => {
    messageApi.error('不准摸！');
    
    // 页面震动效果
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 500);
  };
  return (
    <>
      {contextHolder}
      <ResponsiveLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
       
        
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Avatar 
              size={120} 
              src={avatarImage} 
              onClick={handleAvatarClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.2)',
                border: isHovered ? '3px solid #4ecdc4' : '2px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <Title level={3} style={{ marginTop: '16px' }}>CreatL</Title>
            <Paragraph type="secondary">桔子酱 | cr3atL</Paragraph>
            {isHovered && (
              <Paragraph style={{ 
                color: '#4ecdc4', 
                fontSize: '14px',
                animation: 'pulse 1.5s infinite',
                marginTop: '8px'
              }}>
                点击就可以摸摸桔子酱！
              </Paragraph>
            )}
          </div>
          
          <Paragraph>
            你好我是桔子酱
          </Paragraph>
          
          <Paragraph>
            我喜欢玩osu
          </Paragraph>
        </Card>
        
        <Card title="技能专长" style={{ marginBottom: '24px' }}>
          <Space size={[8, 16]} wrap>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="blue">OSU!Mania</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
            <Tag color="red">原神</Tag>
          </Space>
        </Card>
        
        <Card title="联系方式">
          <Paragraph>
            <img src={QQIcon} alt="QQ" style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
            <strong></strong> <a href='https://qm.qq.com/q/MFdHgohGqm'>点击添加我的QQ</a>
          </Paragraph>
          <Paragraph>
            <GithubOutlined />
            <strong>GitHub：</strong> <a href='https://github.com/cr3atL' target='_blank' rel='noreferrer'>cr3atL</a>
          </Paragraph>
          <Paragraph>
            <strong>个人网站：</strong> 目前就是这个吧
          </Paragraph>
        </Card>
      </div>
    </ResponsiveLayout>
    </>
  );
};

export default About;