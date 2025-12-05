import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import InstagramFloat from './components/InstagramFloat';
import Home from './pages/Home';
import Play from './pages/Play';
import Rules from './pages/Rules';
import History from './pages/History';
import AboutUs from './pages/AboutUs';
import Settings from './pages/Settings';
import './styles/App.css';

function App() {
  // Set basename for GitHub Pages subdirectory (only in production)
  // In development, use empty string so it works on localhost
  const basename = process.env.NODE_ENV === 'production' ? '/toguz-korgool' : '';
  
  return (
    <Router basename={basename}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
        <InstagramFloat />
      </div>
    </Router>
  );
}

export default App;


