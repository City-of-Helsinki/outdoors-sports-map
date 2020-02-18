import React from 'react';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="loading">
      {t('GENERAL.LOADING')}
    </div>
  );
};

export default Loading;
