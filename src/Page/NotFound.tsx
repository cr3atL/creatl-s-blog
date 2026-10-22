import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/content-pages.css';
import '../styles/pages/not-found.css';

export default function NotFound() {
  const navigate = useNavigate();
  return <ResponsiveLayout>
    <div className="content-page not-found-page" data-motion-section>
      <span className="not-found-code" aria-hidden="true">404</span>
      <h1>找不到这个页面</h1>
      <p>链接可能有误，或页面已经移动。</p>
      <Button type="primary" onClick={() => {
        trackEvent('Navigation', 'Click', 'NotFound_ReturnHome');
        navigate('/');
      }}>返回首页</Button>
    </div>
  </ResponsiveLayout>;
}
