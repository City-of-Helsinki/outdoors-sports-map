import PropTypes from "prop-types";
import React from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "../../i18n";

function TranslationProvider({ children }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranslationProvider;
