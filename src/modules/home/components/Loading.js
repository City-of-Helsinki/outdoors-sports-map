import React from 'react';
import { withNamespaces } from 'react-i18next';

const Loading = withNamespaces()(({ t }) => (
  <div className="loading">{t('GENERAL.LOADING')}</div>
));

export default Loading;
