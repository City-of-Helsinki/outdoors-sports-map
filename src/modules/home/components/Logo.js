import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Logo = () => {
  const { t } = useTranslation();

  return (
    <div className="logo">
      <h2><Link to="/">{t('APP.NAME')}</Link></h2>
    </div>
  );
};

export default Logo;
