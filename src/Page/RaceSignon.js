import { Typography, Form, Input, Button } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title, Paragraph } = Typography;

const RaceSignon = () => {
  return (
    <ResponsiveLayout>
      <div className="page-container page-container--narrow">
        <section className="page-hero">
          <div className="page-hero-content">
            <div className="page-eyebrow">Tool</div>
            <Title level={2}>比赛报名</Title>
            <Paragraph className="page-intro">
              轻量报名表单，后续会继续补齐提交和确认流程。
            </Paragraph>
          </div>
        </section>

        <section className="page-section race-form-section">
          <Form layout="vertical" className="quiet-form">
            <Form.Item label="游戏 ID">
              <Input />
            </Form.Item>
            <Form.Item label="RATING">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary">报名</Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default RaceSignon;
