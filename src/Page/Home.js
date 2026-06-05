import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import ArchiveHero from '../components/archive/ArchiveHero';
import ArchiveLog from '../components/archive/ArchiveLog';
import ProcessRow from '../components/archive/ProcessRow';
import SectionHeader from '../components/archive/SectionHeader';
import { trackEvent } from '../utils/analytics';
import archiveLogs from '../data/archiveLogs';
import socialLinks from '../data/socialLinks';
import tools from '../data/tools';
import '../styles/pages/home.css';

const { Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const isArchiveTheme =
    typeof document !== 'undefined' &&
    (document.documentElement.dataset.uiTheme === 'ascii-modern' ||
      document.documentElement.dataset.uiTheme === 'archive-terminal');

  const handleToolClick = (path, label) => {
    trackEvent('Navigation', 'Click', label);
    navigate(path);
  };

  const handleAllToolsClick = () => {
    trackEvent('Navigation', 'Click', 'Tools_Directory');
    navigate('/tools');
  };

  return (
    <ResponsiveLayout>
      <div className="page-container home-page">
        {isArchiveTheme ? (
          <ArchiveHero socialLinks={socialLinks} />
        ) : (
          <section
            className="page-hero home-hero-legacy"
            aria-label="Personal archive entry"
          >
            <div className="page-hero-content">
              <div className="page-eyebrow">个人主页 + 工具站</div>
              <Typography.Title level={2}>creatL 的小站</Typography.Title>
              <Paragraph className="page-intro">
                这里会放一些个人内容、文章和随手做的小工具。Archive Terminal
                主题预览会在 archive-terminal / ascii-modern 模式下启用。
              </Paragraph>
            </div>
          </section>
        )}

        <section
          className="home-section home-section--log"
          aria-labelledby="home-section-archive-log-title"
        >
          <SectionHeader
            number="02"
            title="ARCHIVE LOG"
            meta={`${archiveLogs.length} ENTRIES`}
            id="home-section-archive-log-title"
          />
          <ArchiveLog
            entries={archiveLogs}
            labelledBy="home-section-archive-log-title"
          />
        </section>

        <section
          className="home-section home-section--tools"
          aria-labelledby="home-section-tools-title"
        >
          <SectionHeader
            number="03"
            title="SELECTED TOOLS"
            meta="PROCESS QUEUE"
            id="home-section-tools-title"
          />
          <div className="home-section__tools">
            {tools.map((tool) => (
              <ProcessRow
                key={tool.key}
                number={tool.number}
                category={tool.category}
                title={tool.title}
                description={tool.description}
                status={tool.status}
                onOpen={(path) => handleToolClick(path, tool.analyticsLabel)}
                path={tool.path}
              />
            ))}
          </div>
          <div className="home-section__tools-footer">
            <Button
              type="link"
              onClick={handleAllToolsClick}
              className="home-section__inline-link"
            >
              VIEW ALL TOOLS →
            </Button>
          </div>
        </section>

        <section
          className="home-section home-section--about"
          aria-labelledby="home-section-about-title"
        >
          <SectionHeader
            number="04"
            title="ABOUT SNAPSHOT"
            id="home-section-about-title"
          />
          <Paragraph className="home-section__about-body">
            我是桔子酱 / creatL，正在学习 React 前端开发。平时喜欢 osu!mania、
            定轨音游和 trance。完整介绍可以在
            <a
              href="/about"
              onClick={(event) => {
                event.preventDefault();
                trackEvent('Navigation', 'Click', 'About_Snapshot');
                navigate('/about');
              }}
              className="home-section__about-link"
            >
              关于页面
            </a>
            找到。
          </Paragraph>
        </section>

        <section
          className="home-section home-section--writing"
          aria-labelledby="home-section-writing-title"
        >
          <SectionHeader
            number="05"
            title="WRITING PREVIEW"
            meta="[EMPTY]"
            id="home-section-writing-title"
          />
          <p className="home-section__writing-empty">
            [EMPTY] articles are being organized
          </p>
          <div className="home-section__writing-footer">
            <Button
              type="link"
              onClick={() => {
                trackEvent('Navigation', 'Click', 'Writing_Preview');
                navigate('/article');
              }}
              className="home-section__inline-link"
            >
              OPEN WRITING →
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Home;
