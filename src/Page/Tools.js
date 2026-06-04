import { Button, Typography } from 'antd';
import { PictureOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title, Paragraph } = Typography;

const tools = [
  {
    key: 'random-image',
    title: '随机兔子图片',
    description: '从本地图片集中随机抽一张兔子图片，适合放松一下。',
    path: '/randomssiba',
    icon: <PictureOutlined />,
  },
  {
    key: 'race-signon',
    title: '比赛报名',
    description: '保留中的轻量报名工具，后续可以继续完善表单流程。',
    path: '/race-signon',
    icon: <TrophyOutlined />,
  },
];

const Tools = () => {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium">
        <section className="page-hero">
          <div className="page-hero-content">
            <div className="page-eyebrow">Tools</div>
            <Title level={2}>工具</Title>
            <Paragraph className="page-intro">
              这里放一些已经可用或正在打磨的小工具。旧曲库页面暂时下线，
              之后会用更清晰的结构重做。
            </Paragraph>
          </div>
        </section>

        <section className="page-section">
          <div className="page-grid page-grid--two">
            {tools.map((tool) => (
              <div key={tool.key} className="tool-card">
                <span className="tool-card-icon">{tool.icon}</span>
                <div className="tool-card-body">
                  <Title level={4}>{tool.title}</Title>
                  <Paragraph className="page-body-text">{tool.description}</Paragraph>
                </div>
                <Button type="primary" onClick={() => navigate(tool.path)}>
                  打开
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section">
          <Title level={3}>未来工具</Title>
          <Paragraph className="page-body-text">
            新工具会优先放在这里。导航保持简短，首页只保留核心入口。
          </Paragraph>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Tools;
