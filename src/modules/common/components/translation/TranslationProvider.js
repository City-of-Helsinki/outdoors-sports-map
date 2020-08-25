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
import getLanguage from '../../../language/selectors';
import { DEFAULT_LANG } from '../../constants';

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

const i18n = i18next
  .init({
    resources: localesByName,
    lng: DEFAULT_LANG, // @todo: How should the user pick their preferred language? #UX
  }, (err, t) => {
    // @todo: do we have some error reporting mechanism in production?
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err, t);
    }
  });

class TranslationProvider extends React.Component {
  componentWillMount() {
    const { language } = this.props;

    if (language !== DEFAULT_LANG) {
      this.changeLanguage(this.props.language);
      this.forceUpdate();
    } else {
      moment.locale(language);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.changeLanguage(nextProps.language);
  }

  changeLanguage = (nextLanguage) => {
    i18n.changeLanguage(nextLanguage);
    moment.locale(nextLanguage);
  }

  render() {
    return <I18nextProvider i18n={i18n}>{this.props.children}</I18nextProvider>;
  }
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

export default connect(mapStateToProps)(TranslationProvider);
