import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from '../../common/components/Link';

const Logo = () => {
  const { t } = useTranslation();

  return (
    <div className="logo">
      <h2>
        <Link to="/">{t('APP.NAME')}</Link>
      </h2>
    </div>
  );
};

export default Logo;
