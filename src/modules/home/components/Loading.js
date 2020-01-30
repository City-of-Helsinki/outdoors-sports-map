import React from 'react';
import { translate } from 'react-i18next';

const Loading = translate()(({ t }) => (
  <div className="loading">
    {t('GENERAL.LOADING')}
  </div>
));

export default Loading;
