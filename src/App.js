import './styles/responsive.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Page/Home';
import Article from './Page/Article';
import About from './Page/About';
import Randomssiba from './Page/Randomssiba';
import ChunithmSongs from './Page/ChunithmSongs';
import SdvxSongs from './Page/SdvxSongs';
import { initGA, trackPageView } from './utils/analytics';

// Google Analytics 跟踪 ID - 请替换为您的实际跟踪 ID
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// 页面追踪组件
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
    // 初始化 Google Analytics
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
        <Route path='/about' element={<About />} />
        <Route path='/article' element={<Article/>} />
        <Route path="/randomssiba" element={<Randomssiba/>} />
        <Route path="/chunithm-songs" element={<ChunithmSongs/>} />
        <Route path="/sdvx-songs" element={<SdvxSongs/>} />
      </Routes>
    </Router>
  );
}

export default App;