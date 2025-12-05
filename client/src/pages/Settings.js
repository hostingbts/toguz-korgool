import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import soundManager from '../utils/sounds';
import './Settings.css';

function Settings() {
  const { t, i18n } = useTranslation();
  const [soundEffects, setSoundEffects] = useState(true);
  const [boardTheme, setBoardTheme] = useState('light');

  useEffect(() => {
    // Load settings from localStorage
    const savedSound = localStorage.getItem('soundEffects');
    const savedTheme = localStorage.getItem('boardTheme');

    if (savedSound !== null) {
      const soundEnabled = savedSound === 'true';
      setSoundEffects(soundEnabled);
      soundManager.setEnabled(soundEnabled);
    }
    if (savedTheme) {
      setBoardTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set default theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const handleSoundChange = (value) => {
    setSoundEffects(value);
    localStorage.setItem('soundEffects', value);
    soundManager.setEnabled(value);
    // Play a test sound if enabling
    if (value) {
      soundManager.playStoneMove();
    }
  };

  const handleThemeChange = (value) => {
    setBoardTheme(value);
    localStorage.setItem('boardTheme', value);
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="page settings-page">
      <div className="container">
        <h1 className="page-title">{t('settings.title')}</h1>

        <div className="settings-content">
          <section className="setting-section">
            <h2>{t('settings.soundEffects')}</h2>
            <div className="setting-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => handleSoundChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-label">
                {soundEffects ? 'On' : 'Off'}
              </span>
            </div>
          </section>

          <section className="setting-section">
            <h2>{t('settings.boardTheme')}</h2>
            <div className="setting-control">
              <select
                value={boardTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="theme-select"
              >
                <option value="light">{t('settings.light')}</option>
                <option value="dark">{t('settings.dark')}</option>
              </select>
            </div>
          </section>

          <section className="setting-section">
            <h2>{t('settings.language')}</h2>
            <div className="setting-control">
              <div className="language-buttons">
                <button
                  className={`lang-btn ${i18n.language === 'kg' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('kg')}
                >
                  Кыргызча
                </button>
                <button
                  className={`lang-btn ${i18n.language === 'kz' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('kz')}
                >
                  Қазақша
                </button>
                <button
                  className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('ru')}
                >
                  Русский
                </button>
                <button
                  className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;


