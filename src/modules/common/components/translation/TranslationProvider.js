import React from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';

const TranslationProvider = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranslationProvider;
