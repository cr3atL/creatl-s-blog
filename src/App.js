import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Page/Home';
import Article from './Page/Article';
import About from './Page/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/article' element={<Article/>} />
      </Routes>
    </Router>
  );
}

export default App;