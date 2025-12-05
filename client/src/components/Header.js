import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || (hasTouchScreen && isSmallScreen));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <svg 
            className="logo-svg" 
            width="320" 
            height="100" 
            viewBox="0 0 320 100" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background transparent */}
            <rect width="320" height="100" fill="none"/>

            {/* Emblem circle */}
            <g>
              {/* Circle (board) */}
              <circle
                cx="60"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />

              {/* 9 pits (stones) in a 3x3 grid */}
              {/* top row */}
              <circle cx="40" cy="34" r="5" fill="#F97316" />
              <circle cx="60" cy="34" r="5" fill="#F97316" />
              <circle cx="80" cy="34" r="5" fill="#F97316" />

              {/* middle row */}
              <circle cx="40" cy="50" r="5" fill="#F97316" />
              <circle cx="60" cy="50" r="5" fill="#F97316" />
              <circle cx="80" cy="50" r="5" fill="#F97316" />

              {/* bottom row */}
              <circle cx="40" cy="66" r="5" fill="#F97316" />
              <circle cx="60" cy="66" r="5" fill="#F97316" />
              <circle cx="80" cy="66" r="5" fill="#F97316" />
            </g>

            {/* Text: KORGOOL - centered vertically with logo */}
            <g transform="translate(115,50)">
              {/* KORGOOL wordmark */}
              <text 
                x="0" 
                y="0" 
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="32" 
                fontWeight="600" 
                letterSpacing="2.2" 
                fill="currentColor"
                textAnchor="start"
                dominantBaseline="central"
              >
                KORGOOL
              </text>
            </g>
          </svg>
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('common.home')}
          </Link>
          <Link 
            to="/play" 
            className={`nav-link ${isActive('/play') ? 'active' : ''}`}
          >
            {t('common.play')}
          </Link>
          <Link 
            to="/rules" 
            className={`nav-link ${isActive('/rules') ? 'active' : ''}`}
          >
            {t('common.rules')}
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
          >
            {t('common.history')}
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            {t('common.aboutUs')}
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            {t('common.settings')}
          </Link>
          <div className="language-selector">
            {isMobile ? (
              /* Mobile: Dropdown */
              <select
                className="language-dropdown"
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="kg">KG</option>
                <option value="kz">KZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>
            ) : (
              /* Desktop: Button group */
              <div className="language-buttons">
                <button
                  className={`language-btn ${i18n.language === 'kg' ? 'active' : ''}`}
                  onClick={() => changeLanguage('kg')}
                >
                  KG
                </button>
                <button
                  className={`language-btn ${i18n.language === 'kz' ? 'active' : ''}`}
                  onClick={() => changeLanguage('kz')}
                >
                  KZ
                </button>
                <button
                  className={`language-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                  onClick={() => changeLanguage('ru')}
                >
                  RU
                </button>
                <button
                  className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;


