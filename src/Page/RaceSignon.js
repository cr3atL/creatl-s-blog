import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/race-signon.css';

const RaceSignon = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    trackEvent('Race_Signon', 'Submit', 'Form_Channel');
    setTimeout(() => {
      messageApi.info('当前表单用于轻量收集报名意向。');
      setSubmitting(false);
    }, 320);
  };

  return (
    <>
      {contextHolder}
      <ResponsiveLayout>
        <div className="page-container page-container--narrow race-signon-page">
          <section
            className="race-signon-hero"
            aria-labelledby="race-signon-hero-title"
          >
            <span className="race-signon-hero__eyebrow">TOOL / RACE SIGN-ON</span>
            <h1 id="race-signon-hero-title" className="race-signon-hero__title">
              比赛报名
            </h1>
            <p className="race-signon-hero__intro">
              填写游戏 ID 和当前 RATING 即可提交。
              当前表单用于轻量收集报名意向。
            </p>
          </section>

          <section
            className="race-signon-section"
            aria-labelledby="race-signon-form-title"
          >
            <SectionHeader
              number="F.1"
              title="SIGN-ON FORM"
              id="race-signon-form-title"
              meta={submitting ? 'SUBMITTING' : 'STANDBY'}
            />
            <Form layout="vertical" className="race-signon-form">
              <Form.Item label="游戏 ID">
                <Input placeholder="请输入游戏 ID" autoComplete="off" />
              </Form.Item>
              <Form.Item label="RATING">
                <Input placeholder="请输入当前 RATING" autoComplete="off" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={handleSubmit}
                  className="race-signon-form__submit"
                >
                  报名
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </ResponsiveLayout>
    </>
  );
};

export default RaceSignon;
