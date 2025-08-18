import React from 'react';
import { Typography, Card, List, Tag, Space, Button } from 'antd';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;

const Article = () => {
  const articles = [
    {
      id: 1,
      title:"Osu!mania怎么玩",
      summary:"乱玩,爱咋玩咋玩",
      date:"2025-8-19",
      readTime:"114514分钟",
      tags:['Osu!mania','how2play'],

    }
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Title>文章列表</Title>
        <Paragraph style={{ marginBottom: '32px' }}>
          我乱写的，你们随便看看就行
        </Paragraph>
        
        <List
          itemLayout="vertical"
          size="large"
          dataSource={articles}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card 
                hoverable
                style={{ marginBottom: '16px' }}
                onClick={() => window.location.href = `/article/${item.id}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={3} style={{ marginBottom: '8px' }}>{item.title}</Title>
                    <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
                      {item.summary}
                    </Paragraph>
                    <Space>
                      <span style={{ color: '#999', fontSize: '14px' }}>{item.date}</span>
                      <span style={{ color: '#999', fontSize: '14px' }}>阅读时间: {item.readTime}</span>
                    </Space>
                    <div style={{ marginTop: '12px' }}>
                      <Space>
                        {item.tags.map(tag => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                  <Button type="primary" style={{ marginLeft: '16px' }}>
                    阅读全文
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Layout>
  );
};

export default Article;