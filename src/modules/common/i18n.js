import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

import { SUPPORTED_LANGUAGES } from '../language/constants';
import { DEFAULT_LANG } from './constants';

const getTranslations = () => ({
  fi: {
    // eslint-disable-next-line global-require
    translation: require('../../../locales/fi.json'),
  },
  sv: {
    // eslint-disable-next-line global-require
    translation: require('../../../locales/sv.json'),
  },
  en: {
    // eslint-disable-next-line global-require
    translation: require('../../../locales/en.json'),
  },
});

const localesByName = getTranslations();
const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

function changeDocumentLanguage(nextLanguage) {
  document.documentElement.lang = nextLanguage;
}

i18n
  // Configure language changed hook first so that it is fired on language
  // initialization as well.
  .on('languageChanged', (nextLanguage) => {
    moment.locale(nextLanguage);
    changeDocumentLanguage(nextLanguage);
  })
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      load: 'languageOnly',
      whitelist: supportedLanguages,
      resources: localesByName,
      fallbackLng: DEFAULT_LANG,
      interpolation: {
        escapeValue: false,
      },
    },
    (err, t) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err, t);
      }
    }
  );

// Auto-detected language generally has a country code. Ignore it.
export const getCurrentLanguage = () => i18n.language.split('-')[0];

export default i18n;
