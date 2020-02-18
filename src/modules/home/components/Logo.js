import React from 'react';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';

export default withNamespaces()(({ t }) => (
  <div className="logo">
    <h2><Link to="/">{t('APP.NAME')}</Link></h2>
  </div>
));
