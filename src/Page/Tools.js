import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import ProcessRow from '../components/archive/ProcessRow';
import StatusTag from '../components/archive/StatusTag';
import { trackEvent } from '../utils/analytics';
import tools from '../data/tools';
import '../styles/pages/tools.css';

const { Paragraph } = Typography;

const futureEntries = [
  {
    number: '004',
    category: 'UTILITY',
    title: '文章摘要',
    description: '把文章列表整理成可筛选、可排序的摘要视图。',
    status: 'COMING SOON',
  },
];

const Tools = () => {
  const navigate = useNavigate();

  const handleOpen = (path) => {
    trackEvent('Navigation', 'Click', 'Tools_Page');
    navigate(path);
  };

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium tools-page">
        <section
          className="tools-hero"
          aria-labelledby="tools-hero-title"
        >
          <div className="tools-hero__lead">
            <span className="tools-hero__eyebrow">03 / TOOLS</span>
            <h1 id="tools-hero-title" className="tools-hero__title">
              可以立即使用的小工具
            </h1>
            <Paragraph className="tools-hero__intro">
              这里是目前可以直接打开使用的小工具。每一条都标了编号、
              分类和当前状态，点击 OPEN 就能进入。
            </Paragraph>
          </div>
          <dl className="tools-hero__status" aria-label="tool station status">
            <div>
              <dt>QUEUE</dt>
              <dd>{tools.length} ACTIVE</dd>
            </div>
            <div>
              <dt>STATION</dt>
              <dd>ONLINE</dd>
            </div>
          </dl>
        </section>

        <section
          className="tools-section"
          aria-labelledby="tools-process-queue-title"
        >
          <SectionHeader
            number="03.1"
            title="AVAILABLE TOOLS"
            id="tools-process-queue-title"
            meta="READY + DRAFT"
          />
          <div className="tools-section__list">
            {tools.map((tool) => (
              <ProcessRow
                key={tool.key}
                number={tool.number}
                category={tool.category}
                title={tool.title}
                description={tool.description}
                status={tool.status}
                onOpen={() => handleOpen(tool.path)}
                path={tool.path}
              />
            ))}
          </div>
        </section>

        <section
          className="tools-section"
          aria-labelledby="tools-future-queue-title"
        >
          <SectionHeader
            number="03.2"
            title="UPCOMING"
            id="tools-future-queue-title"
            meta="COMING SOON + ARCHIVED"
          />
          <ul className="tools-future" aria-label="upcoming tools">
            {futureEntries.map((entry) => (
              <li
                key={entry.number}
                className="tools-future__entry"
                data-status={entry.status}
              >
                <div className="tools-future__meta">
                  <span className="tools-future__label">PROCESS</span>
                  <span className="tools-future__number">{entry.number}</span>
                  <span className="tools-future__divider" aria-hidden="true">
                    /
                  </span>
                  <span className="tools-future__category">{entry.category}</span>
                </div>
                <div className="tools-future__body">
                  <h3 className="tools-future__title">{entry.title}</h3>
                  <p className="tools-future__description">{entry.description}</p>
                </div>
                <div className="tools-future__action">
                  <StatusTag status={entry.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Tools;
