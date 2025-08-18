import React from 'react';
import { Typography, Row, Col, Card, Avatar } from 'antd';
import Layout from '../components/Layout';
const avatarImage = 'https://github.com/cr3atL.png';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar src={avatarImage} size={64} style={{ 
            marginRight: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }} />
          <Title level={2}>欢迎来到我的博客</Title>
        </div>
        <Paragraph>
          这是我乱写的博客
        </Paragraph>
        
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={8}>
            <Card 
              title="暂无" 
              hoverable
              onClick={() => window.location.href = '/articles'}
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <p>暂无</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              title="暂无" 
              hoverable
              onClick={() => window.location.href = '/articles'}
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <p>暂无</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              title="暂无" 
              hoverable
              onClick={() => window.location.href = '/articles'}
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <p>暂无</p>
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: '32px' }}>
          <Title level={3}>最新动态</Title>
          <Paragraph>
            博客正在开发中，敬请期待更多精彩内容...
          </Paragraph>
        </div>
      </div>
    </Layout>
  );
};

export default Home;