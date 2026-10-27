import ResponsiveLayout from '../components/ResponsiveLayout';
import games from '../data/games';
import { trackEvent } from '../utils/analytics';
import '../styles/pages/content-pages.css';
import '../styles/pages/tools.css';

export default function Games() {
  return <ResponsiveLayout>
    <div className="content-page games-page">
      <h1 data-motion-section>游戏</h1>
      <ul className="tools-list" data-motion-section>
        {games.map(game => <li key={game.key}>
          <a href={game.path} className="tool-entry" target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('Navigation', 'Click', game.analyticsLabel)}>
            <span className="tool-entry__body">
              <span className="tool-entry__title">{game.title}</span>
              <span className="tool-entry__description">{game.description}</span>
            </span>
            <span aria-hidden="true" className="tool-entry__arrow">↗</span>
          </a>
        </li>)}
      </ul>
    </div>
  </ResponsiveLayout>;
}
