import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="page home-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">{t('home.welcome')}</h1>
          <p className="hero-subtitle">{t('game.subtitle')}</p>
          <p className="hero-description">{t('home.description')}</p>
          <Link to="/play" className="btn btn-primary">
            {t('common.play')}
          </Link>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h2>{t('home.culturalSignificance')}</h2>
            <p>{t('home.culturalText')}</p>
          </div>

          <div className="feature-card">
            <h2>{t('home.howToPlay')}</h2>
            <p>{t('home.playDescription')}</p>
            <div className="game-modes">
              <div className="mode-item">
                <span className="mode-icon">🤖</span>
                <span>{t('game.playVsComputer')}</span>
              </div>
              <div className="mode-item">
                <span className="mode-icon">🌐</span>
                <span>{t('game.playOnline')}</span>
              </div>
              <div className="mode-item">
                <span className="mode-icon">👥</span>
                <span>{t('game.passAndPlay')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/rules" className="btn btn-secondary">
            {t('common.rules')}
          </Link>
          <Link to="/history" className="btn btn-secondary">
            {t('common.history')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;


