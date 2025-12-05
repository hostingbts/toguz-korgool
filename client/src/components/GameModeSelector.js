import React from 'react';
import { useTranslation } from 'react-i18next';
import { GAME_MODES } from '../game/gameLogic';
import './GameModeSelector.css';

function GameModeSelector({ onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="game-mode-selector">
      <h2 className="selector-title">{t('common.play')}</h2>
      <p className="selector-subtitle">{t('game.subtitle')}</p>
      
      <div className="mode-buttons">
        <button
          className="game-mode-btn"
          onClick={() => onSelect(GAME_MODES.VS_COMPUTER)}
        >
          <div className="mode-icon">🤖</div>
          <div className="mode-content">
            <h3>{t('game.playVsComputer')}</h3>
            <p>{t('game.selectDifficulty')}</p>
          </div>
        </button>

        <button
          className="game-mode-btn"
          onClick={() => onSelect(GAME_MODES.ONLINE)}
        >
          <div className="mode-icon">🌐</div>
          <div className="mode-content">
            <h3>{t('game.playOnline')}</h3>
            <p>{t('game.createRoom')} / {t('game.joinRoom')}</p>
          </div>
        </button>

        <button
          className="game-mode-btn"
          onClick={() => onSelect(GAME_MODES.PASS_PLAY)}
        >
          <div className="mode-icon">👥</div>
          <div className="mode-content">
            <h3>{t('game.passAndPlay')}</h3>
            <p>{t('game.passAndPlay')}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default GameModeSelector;


