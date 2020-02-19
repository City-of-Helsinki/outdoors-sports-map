import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import getLanguage from '../../../language/selectors';
import changeLanguage from '../../../language/actions';
import { getCurrentLanguage } from '../../i18n';

const TranslationProvider = ({ changeLanguageAction, children, language }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!language) {
      const currentLanguage = getCurrentLanguage();
      changeLanguageAction(currentLanguage);
    }
  }, []);

  useEffect(() => {
    const currentLanguage = getCurrentLanguage();

    // This will also run on init. Do nothing.
    if (language && currentLanguage !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <>
      {children}
    </>
  );
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLanguageAction: changeLanguage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TranslationProvider);
