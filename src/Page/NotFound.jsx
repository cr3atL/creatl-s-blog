import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import SectionHeader from '../components/archive/SectionHeader';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/not-found.css';

const asciiFrame = `    .-.
   (404)
    '-'
  / lost \\`;

const NotFound = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    trackEvent('Navigation', 'Click', 'NotFound_ReturnHome');
    navigate('/');
  };

  return (
    <ResponsiveLayout>
      <div className="page-container page-container--medium not-found-page">
        <section
          className="not-found-hero"
          aria-labelledby="not-found-hero-title"
        >
          <span className="not-found-hero__eyebrow">ARCHIVE NODE</span>
          <h1 id="not-found-hero-title" className="not-found-hero__title">
            [404] archive node missing
          </h1>
          <p className="not-found-hero__intro">
            The requested page is not registered in this station.
          </p>
          <pre className="not-found-ascii" aria-hidden="true">
            {asciiFrame}
          </pre>
        </section>

        <section
          className="not-found-section"
          aria-labelledby="not-found-status-title"
        >
          <SectionHeader
            number="0.0"
            title="NODE STATUS"
            id="not-found-status-title"
            meta="[OFFLINE]"
          />
          <dl className="not-found-status" aria-label="node status">
            <div>
              <dt>REQUEST</dt>
              <dd>UNKNOWN PATH</dd>
            </div>
            <div>
              <dt>CAUSE</dt>
              <dd>LINK DRIFT / NODE OFFLINE</dd>
            </div>
            <div>
              <dt>ACTION</dt>
              <dd>RETURN TO STATION</dd>
            </div>
          </dl>
          <div className="not-found-actions">
            <Button
              type="primary"
              onClick={handleReturn}
              className="not-found-actions__button"
            >
              RETURN HOME
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default NotFound;
