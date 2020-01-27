import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

export default translate()(({ attributionLink, t }) => (
  <div className="disclaimer">
    <div className="disclaimer__content">
      <Link to="#">{t('APP.ABOUT')}</Link>
      <a target="_blank" href={attributionLink}>
        {t('MAP.ATTRIBUTION')}
        {' '}
      </a>
    </div>
  </div>
));
