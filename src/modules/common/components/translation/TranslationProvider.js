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
import getLanguage from '../../../language/selectors';
import { DEFAULT_LANG } from '../../constants';

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
    lng: DEFAULT_LANG, // @todo: How should the user pick their preferred language? #UX
  }, (err, t) => {
    // @todo: do we have some error reporting mechanism in production?
    if (err) {
      console.log(err, t);
    }
  });

class TranslationProvider extends React.Component {
  componentWillMount() {
    if (this.props.language !== DEFAULT_LANG) {
      i18n.changeLanguage(this.props.language);
      this.forceUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    i18n.changeLanguage(nextProps.language);
  }

  render() {
    return <I18nextProvider i18n={i18n}>{this.props.children}</I18nextProvider>;
  }
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
});

export default connect(mapStateToProps)(TranslationProvider);
