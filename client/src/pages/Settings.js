import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DIFFICULTY_LEVELS } from '../game/ai';
import './Settings.css';

function Settings() {
  const { t, i18n } = useTranslation();
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [boardTheme, setBoardTheme] = useState('light');
  const [aiDifficulty, setAiDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);

  useEffect(() => {
    // Load settings from localStorage
    const savedSound = localStorage.getItem('soundEffects');
    const savedAnimations = localStorage.getItem('animations');
    const savedTheme = localStorage.getItem('boardTheme');
    const savedDifficulty = localStorage.getItem('aiDifficulty');

    if (savedSound !== null) setSoundEffects(savedSound === 'true');
    if (savedAnimations !== null) setAnimations(savedAnimations === 'true');
    if (savedTheme) setBoardTheme(savedTheme);
    if (savedDifficulty) setAiDifficulty(Number(savedDifficulty));
  }, []);

  const handleSoundChange = (value) => {
    setSoundEffects(value);
    localStorage.setItem('soundEffects', value);
  };

  const handleAnimationsChange = (value) => {
    setAnimations(value);
    localStorage.setItem('animations', value);
  };

  const handleThemeChange = (value) => {
    setBoardTheme(value);
    localStorage.setItem('boardTheme', value);
    document.documentElement.setAttribute('data-theme', value);
  };

  const handleDifficultyChange = (value) => {
    setAiDifficulty(value);
    localStorage.setItem('aiDifficulty', value);
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
            <h2>{t('settings.animations')}</h2>
            <div className="setting-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => handleAnimationsChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-label">
                {animations ? 'On' : 'Off'}
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
            <h2>{t('settings.aiDifficulty')}</h2>
            <div className="setting-control">
              <select
                value={aiDifficulty}
                onChange={(e) => handleDifficultyChange(Number(e.target.value))}
                className="difficulty-select"
              >
                <option value={DIFFICULTY_LEVELS.EASY}>{t('game.easy')}</option>
                <option value={DIFFICULTY_LEVELS.MEDIUM}>{t('game.medium')}</option>
                <option value={DIFFICULTY_LEVELS.HARD}>{t('game.hard')}</option>
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


