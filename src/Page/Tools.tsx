import { Link } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { trackEvent } from '../utils/analytics';
import tools from '../data/tools';
import '../styles/pages/content-pages.css';
import '../styles/pages/tools.css';

export default function Tools() {
  return <ResponsiveLayout>
    <div className="content-page tools-page">
      <h1 data-motion-section>小工具</h1>
      <ul className="tools-list" data-motion-section>
        {tools.map(tool => <li key={tool.key}>
          <Link to={tool.path} className="tool-entry" onClick={() => {
            trackEvent('Navigation', 'Click', 'Tools_Page');
          }}>
            <span className="tool-entry__body">
              <span className="tool-entry__title">{tool.title}</span>
              <span className="tool-entry__description">{tool.description}</span>
            </span>
            <span aria-hidden="true" className="tool-entry__arrow">↗</span>
          </Link>
        </li>)}
      </ul>
    </div>
  </ResponsiveLayout>;
}
