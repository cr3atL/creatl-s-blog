import React from 'react';
import { Typography, Button, message } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/article.css';

const { Paragraph } = Typography;

const articles = [
  {
    id: 'osu-mania-how-to-play',
    title: 'Osu!mania 怎么玩',
    summary: '随手写一点入门体验和个人理解。',
    date: '2025.08.19',
    tags: ['OSU!MANIA', 'HOW2PLAY'],
  },
];

const Article = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleRead = (article) => {
    trackEvent('Article', 'Click', article.id);
    messageApi.info('这篇还没写完 >_<');
  };

  return (
    <>
      {contextHolder}
      <ResponsiveLayout>
        <div className="page-container page-container--medium article-page">
          <section
            className="article-hero"
            aria-labelledby="article-hero-title"
          >
            <span className="article-hero__eyebrow">02 / WRITING</span>
            <h1 id="article-hero-title" className="article-hero__title">
              文章与记录
            </h1>
            <Paragraph className="article-hero__intro">
              文章按 Editorial Archive Feed 的方式排列：左侧日期，中间标题和
              摘要，右侧标签和阅读动作。后续会把更多笔记迁移到这条 Feed。
            </Paragraph>
          </section>

          <section
            className="article-section"
            aria-labelledby="article-feed-title"
          >
            <SectionHeader
              number="02.1"
              title="EDITORIAL ARCHIVE"
              id="article-feed-title"
              meta={`${articles.length} ENTRY`}
            />
            {articles.length === 0 ? (
              <p className="article-section__empty">
                [EMPTY] articles are being organized
              </p>
            ) : (
              <ol className="article-feed" aria-label="article entries">
                {articles.map((article) => (
                  <li key={article.id} className="article-feed__entry">
                    <time className="article-feed__date" dateTime={article.date}>
                      {article.date}
                    </time>
                    <div className="article-feed__body">
                      <h2 className="article-feed__title">{article.title}</h2>
                      <p className="article-feed__summary">{article.summary}</p>
                      <ul className="article-feed__tags" aria-label="article tags">
                        {article.tags.map((tag) => (
                          <li key={tag} className="article-feed__tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="article-feed__action">
                      <Button
                        type="primary"
                        onClick={() => handleRead(article)}
                        className="article-feed__button"
                        aria-label={`阅读全文 ${article.title}`}
                      >
                        READ
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default Article;
