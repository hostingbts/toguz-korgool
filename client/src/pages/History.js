import React from 'react';
import { useTranslation } from 'react-i18next';
import './History.css';

function History() {
  const { t } = useTranslation();

  return (
    <div className="page history-page">
      <div className="container">
        <h1 className="page-title">{t('history.title')}</h1>

        <div className="history-content">
          <section className="history-section">
            <div 
              className="history-text"
              dangerouslySetInnerHTML={{ __html: t('history.historyText') }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default History;

