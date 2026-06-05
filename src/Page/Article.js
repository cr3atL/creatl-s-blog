import React from 'react';
import { Typography, Card, List, Tag, Space, Button, message } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title, Paragraph } = Typography;

const articles = [
  {
    id: 1,
    title: 'Osu!mania 怎么玩',
    summary: '随手写一点入门体验和个人理解。',
    date: '2025-08-19',
    readTime: '114514 分钟',
    tags: ['Osu!mania', 'how2play'],
  },
];

const Article = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info('这篇还没写完 >_<');
  };

  return (
    <>
      {contextHolder}
      <ResponsiveLayout>
        <div className="page-container page-container--medium">
          <section className="page-hero">
            <div className="page-hero-content">
              <div className="page-eyebrow">Articles</div>
              <Title level={2}>文章列表</Title>
              <Paragraph className="page-intro">
                一些随手写的内容，先放在这里慢慢补。
              </Paragraph>
            </div>
          </section>

          <section className="page-section article-feed">
            <List
              className="article-list"
              itemLayout="vertical"
              size="large"
              dataSource={articles}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Card hoverable className="article-list-card article-list-card--editorial">
                    <div className="article-list-content">
                      <div className="article-list-main">
                        <Title level={3} className="article-list-title">
                          {item.title}
                        </Title>
                        <Paragraph className="article-list-summary">
                          {item.summary}
                        </Paragraph>
                        <Space>
                          <span className="article-list-meta">{item.date}</span>
                          <span className="article-list-meta">
                            阅读时间: {item.readTime}
                          </span>
                        </Space>
                        <div className="article-list-tags">
                          <Space>
                            {item.tags.map((tag) => (
                              <Tag key={tag} color="blue">
                                {tag}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        className="article-list-action"
                        onClick={info}
                      >
                        阅读全文
                      </Button>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </section>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default Article;
