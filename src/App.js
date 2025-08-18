import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Page/Home';
import Article from './Page/Article';
import About from './Page/About';
import NotFound from './Page/NotFound';

function App() {
  return (
    <Router basename="/creatl-s-blog">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/article' element={<Article/>} />
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;