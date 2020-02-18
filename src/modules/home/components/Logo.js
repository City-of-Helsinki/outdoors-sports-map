import React from 'react';
import { Link } from 'react-router';
import { withTranslation } from 'react-i18next';

export default withTranslation()(({ t }) => (
  <div className="logo">
    <h2><Link to="/">{t('APP.NAME')}</Link></h2>
  </div>
));
