import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

export default translate()(({ t }) => (
  <div className="logo">
    <h2>
      <Link to="/">{t('APP.NAME')}</Link>
    </h2>
  </div>
));
