import React from 'react';
import { Typography, Card, Avatar, Space, Tag } from 'antd';
import Layout from '../components/Layout';
const avatarImage = 'https://github.com/cr3atL.png';

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
       
        
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Avatar size={120} src={avatarImage} />
            <Title level={3} style={{ marginTop: '16px' }}>CreatL</Title>
            <Paragraph type="secondary">桔子酱 | cr3atL</Paragraph>
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
            <strong>邮箱：</strong> 1439676150@qq.com
          </Paragraph>
          <Paragraph>
            <strong>GitHub：</strong> https://github.com/cr3atL
          </Paragraph>
          <Paragraph>
            <strong>个人网站：</strong> 我没有
          </Paragraph>
        </Card>
      </div>
    </Layout>
  );
};

export default About;