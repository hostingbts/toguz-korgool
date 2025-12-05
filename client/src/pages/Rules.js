import React from 'react';
import { useTranslation } from 'react-i18next';
import './Rules.css';

function Rules() {
  const { t } = useTranslation();

  return (
    <div className="page rules-page">
      <div className="container">
        <h1 className="page-title">{t('rules.title')}</h1>

        <div className="rules-content">
          <section className="rule-section">
            <h2>{t('rules.boardSetup')}</h2>
            <p>{t('rules.boardSetupText')}</p>
            <div className="rule-diagram">
              <div className="board-diagram">
                <div className="diagram-kazan">{t('game.kazanWhite')}</div>
                <div className="diagram-pits">
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                </div>
                <div className="diagram-pits">
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                  <div className="diagram-pit">9</div>
                </div>
                <div className="diagram-kazan">{t('game.kazanBlack')}</div>
              </div>
            </div>
          </section>

          <section className="rule-section">
            <h2>{t('rules.turnMechanics')}</h2>
            <p>{t('rules.turnMechanicsText')}</p>
          </section>

          <section className="rule-section">
            <h2>{t('rules.capturing')}</h2>
            <p>{t('rules.capturingText')}</p>
            <div className="rule-example">
              <strong>{t('rules.capturingExample')}</strong>
            </div>
          </section>

          <section className="rule-section">
            <h2>{t('rules.tuz')}</h2>
            <p>{t('rules.tuzText')}</p>
            <div className="rule-example">
              <strong>{t('rules.tuzImportant')}</strong>
            </div>
          </section>

          <section className="rule-section">
            <h2>{t('rules.endGame')}</h2>
            <p>{t('rules.endGameText')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Rules;


