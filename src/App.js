import './styles/responsive.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Page/Home';
import Article from './Page/Article';
import About from './Page/About';
import Randomssiba from './Page/Randomssiba';
import RaceSignon from './Page/RaceSignon';
import NotFound from './Page/NotFound';
import Tools from './Page/Tools';
import { initGA, trackPageView } from './utils/analytics';

// Google Analytics tracking ID. Replace with the real ID in production.
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACK_ID || 'G-XXXXXXXXXX';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      initGA(GA_TRACKING_ID);
    }
  }, []);

  return (
    <Router basename="/creatl-s-blog">
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/article" element={<Article />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/randomssiba" element={<Randomssiba />} />
        <Route path="/race-signon" element={<RaceSignon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
