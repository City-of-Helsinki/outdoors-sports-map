import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import keyBy from 'lodash/keyBy';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import { SUPPORTED_LANGUAGES } from '../language/constants';
import { DEFAULT_LANG } from './constants';

const localesContext = require.context('../../../locales', false, /\.json$/);

const listOfLocalePaths = localesContext.keys();
const requireLocaleByPath = localesContext;
const localesByPath = mapValues(
  keyBy(listOfLocalePaths, (s) => s),
  (localePath) => ({ translation: requireLocaleByPath(localePath) }),
);

const localesByName = mapKeys(localesByPath, (_, localePath) => localePath.replace(/^\.\//, '').replace(/\.json$/, ''));
const supporteLanguages = Object.values(SUPPORTED_LANGUAGES);

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    load: 'languageOnly',
    whitelist: supporteLanguages,
    nonExplicitWhitelist: true,
    resources: localesByName,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });

// Auto-detected language generally has a country code. Ignore it.
export const getCurrentLanguage = () => i18n.language.split('-')[0];

export default i18n;
