import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

export default translate()(({ attributionLink, t }) => (
  <div className="disclaimer">
    <div className="disclaimer__content">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to="#">{t('APP.ABOUT')}</Link>
      <a target="_blank" href={attributionLink} rel="noopener noreferrer">
        {t('MAP.ATTRIBUTION')}{' '}
      </a>
    </div>
  </div>
));
