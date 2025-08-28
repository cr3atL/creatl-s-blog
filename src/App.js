import './styles/responsive.css';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Home from './Page/Home';
import Article from './Page/Article';
import About from './Page/About';
import Randomssiba from './Page/Randomssiba';
import ChunithmSongs from './Page/ChunithmSongs';

function App() {
  return (
    <Router basename="/creatl-s-blog">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/article' element={<Article/>} />
        <Route path="/randomssiba" element={<Randomssiba/>} />
        <Route path="/chunithm-songs" element={<ChunithmSongs/>} />
      </Routes>
    </Router>
  );
}

export default App;