import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import getLanguage from '../../../language/selectors';
import changeLanguageActionBase from '../../../language/actions';
import i18n, { getCurrentLanguage } from '../../i18n';

function changeDocumentLanguage(nextLanguage) {
  document.documentElement.lang = nextLanguage;
}

function changeLanguage(nextLanguage) {
  i18n.changeLanguage(nextLanguage);
  moment.locale(nextLanguage);
  changeDocumentLanguage(nextLanguage);
}

const TranslationProvider = ({ changeLanguageAction, children, language }) => {
  useEffect(() => {
    if (!language) {
      const currentLanguage = getCurrentLanguage();
      changeLanguageAction(currentLanguage);
      changeLanguage(currentLanguage);
    }
  }, []);

  useEffect(() => {
    const currentLanguage = getCurrentLanguage();

    // This will also run on init. Do nothing.
    if (language && currentLanguage !== language) {
      changeLanguage(language);
    }
  }, [language]);

  return <>{children}</>;
};

TranslationProvider.propTypes = {
  changeLanguageAction: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
};

TranslationProvider.defaultProps = {
  language: null,
};

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeLanguageAction: changeLanguageActionBase,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslationProvider);
