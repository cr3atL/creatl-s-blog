import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium">
        <section className="page-hero empty-state not-found-state">
          <div className="page-hero-content">
            <div className="page-eyebrow">404</div>
            <pre className="not-found-ascii" aria-hidden="true">
              {`    .-.
   (404)
    '-'
  / lost \\`}
            </pre>
            <Title level={2}>页面不存在</Title>
            <Paragraph className="page-intro">
              可能是链接写错了，或者这个页面已经暂时下线。
            </Paragraph>
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default NotFound;
