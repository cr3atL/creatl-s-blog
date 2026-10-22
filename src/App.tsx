import './styles/responsive.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import Home from './Page/Home';
import { getGameById } from './features/song-catalog/config/games';
import { initGA, trackPageView } from './utils/analytics';

const Article = lazy(() => import('./Page/Article'));
const About = lazy(() => import('./Page/About'));
const Randomssiba = lazy(() => import('./Page/Randomssiba'));
const NotFound = lazy(() => import('./Page/NotFound'));
const Tools = lazy(() => import('./Page/Tools'));
const SongCatalogHome = lazy(() => import('./features/song-catalog/components/SongCatalogHome'));
const SongCatalogPage = lazy(() => import('./features/song-catalog/components/SongCatalogPage'));

// Google Analytics tracking ID. Replace with the real ID in production.
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACK_ID || 'G-XXXXXXXXXX';

function PageTracker() {
  const location = useLocation();
  const lastTrackedAddress = useRef<string | null>(null);

  useEffect(() => {
    if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      const address = location.pathname + location.search;
      if (lastTrackedAddress.current === address) return;
      trackPageView(address);
      lastTrackedAddress.current = address;
    }
  }, [location.pathname, location.search]);

  return null;
}

const SongCatalogRoot = () => <SongCatalogHome />;

function App() {
  useEffect(() => {
    if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      initGA(GA_TRACKING_ID);
    }
  }, []);

  return (
    <Router basename="/creatl-s-blog">
      <PageTracker />
      <Suspense fallback={<div className="route-loading" role="status">正在加载页面…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/article" element={<Article />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/songs" element={<SongCatalogRoot />} />
          <Route path="/songs/maimai" element={<SongCatalogPage game={getGameById('maimai')} />} />
          <Route path="/songs/chunithm" element={<SongCatalogPage game={getGameById('chunithm')} />} />
          <Route path="/songs/sdvx" element={<SongCatalogPage game={getGameById('sdvx')} />} />
          <Route path="/randomssiba" element={<Randomssiba />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
