/*
   eslint-disable
   react/destructuring-assignment,
   react/prop-types,
   global-require,
*/

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import getLanguage from '../../../language/selectors';
import { DEFAULT_LANG } from '../../constants';
import { SUPPORTED_LANGUAGES } from '../../../language/constants';
import changeLanguage from '../../../language/actions';

const getTranslations = () => ({
  fi: {
    translation: require('../../../../../locales/fi.json'),
  },
  sv: {
    translation: require('../../../../../locales/sv.json'),
  },
  en: {
    translation: require('../../../../../locales/en.json'),
  },
});

const localesByName = getTranslations();

const i18n = i18next.init(
  {
    resources: localesByName,
    fallbackLng: DEFAULT_LANG,
  },
  (err, t) => {
    // @todo: do we have some error reporting mechanism in production?
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err, t);
    }
  }
);

function findDefaultLanguage() {
  const userLang = navigator.language || navigator.userLanguage;

  if (userLang.includes(SUPPORTED_LANGUAGES.Suomi)) {
    return SUPPORTED_LANGUAGES.Suomi;
  } else if (userLang.includes(SUPPORTED_LANGUAGES.Svenska)) {
    return SUPPORTED_LANGUAGES.Svenska;
  } else if (userLang.includes(SUPPORTED_LANGUAGES.English)) {
    return SUPPORTED_LANGUAGES.English;
  } else {
    return DEFAULT_LANG;
  }
}

class TranslationProvider extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { language } = this.props;

    if (language !== DEFAULT_LANG) {
      this.changeLanguage(this.props.language);
      this.forceUpdate();
    } else {
      moment.locale(language);
      this.changeDocumentLanguage(language);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.changeLanguage(nextProps.language || findDefaultLanguage());
  }

  // Language change
  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.changeLanguage(this.props.language);
    }
  }

  changeLanguage = (nextLanguage) => {
    i18n.changeLanguage(nextLanguage);
    moment.locale(nextLanguage);
    this.changeDocumentLanguage(nextLanguage);
  };

  changeDocumentLanguage = (nextLanguage) => {
    document.documentElement.lang = nextLanguage;
  };

  render() {
    return <I18nextProvider i18n={i18n}>{this.props.children}</I18nextProvider>;
  }
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      changeLanguage,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslationProvider);
