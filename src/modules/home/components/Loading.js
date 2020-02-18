import React from 'react';
import { withTranslation } from 'react-i18next';

const Loading = withTranslation()(({ t }) => (
  <div className="loading">
    {t('GENERAL.LOADING')}
  </div>
));

export default Loading;
