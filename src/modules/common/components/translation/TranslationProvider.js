/*
   eslint-disable
   react/destructuring-assignment,
   react/prop-types,
*/

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getLanguage from '../../../language/selectors';
import { DEFAULT_LANG } from '../../constants';
import { SUPPORTED_LANGUAGES } from '../../../language/constants';
import changeLanguage from '../../../language/actions';

const localesContext = require.context('../../../../../locales', false, /\.json$/);

const listOfLocalePaths = localesContext.keys();
const requireLocaleByPath = localesContext;
const localesByPath = mapValues(
  keyBy(listOfLocalePaths, (s) => s),
  (localePath) => ({ translation: requireLocaleByPath(localePath) }),
);

const localesByName = mapKeys(localesByPath, (_, localePath) => localePath.replace(/^\.\//, '').replace(/\.json$/, ''));

const i18n = i18next
  .init({
    resources: localesByName,
    fallbackLng: DEFAULT_LANG,
  }, (err, t) => {
    // @todo: do we have some error reporting mechanism in production?
    if (err) {
      console.log(err, t);
    }
  });

class TranslationProvider extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    if (this.props.language === null) {
      // No persisted language
      const userLang = navigator.language || navigator.userLanguage;

      if (userLang.includes(SUPPORTED_LANGUAGES.Svenska)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.Svenska);
      } else if (userLang.includes(SUPPORTED_LANGUAGES.English)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.English);
      } else if (userLang.includes(SUPPORTED_LANGUAGES.Suomi)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.Suomi);
      } else {
        this.handleChangeLanguage(DEFAULT_LANG);
      }
    } else {
      // Set persisted language
      i18n.changeLanguage(this.props.language);
    }
  }

  // Language change
  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) i18n.changeLanguage(this.props.language);
  }

  handleChangeLanguage = (language) => {
    this.props.changeLanguage(language);
  }

  render() {
    return <I18nextProvider i18n={i18n}>{this.props.children}</I18nextProvider>;
  }
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeLanguage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TranslationProvider);
