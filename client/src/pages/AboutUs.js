import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutUs.css';

function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="page aboutus-page">
      <div className="container">
        <h1 className="page-title">{t('aboutUs.title')}</h1>

        <div className="aboutus-content">
          <section className="aboutus-section">
            <h2>{t('aboutUs.aboutUsHeading')}</h2>
            <div 
              className="aboutus-text"
              dangerouslySetInnerHTML={{ __html: t('aboutUs.aboutUsContent') }}
            />
          </section>

          <section className="aboutus-section">
            <h2>{t('aboutUs.ourMissionHeading')}</h2>
            <div 
              className="aboutus-text"
              dangerouslySetInnerHTML={{ __html: t('aboutUs.ourMissionContent') }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

