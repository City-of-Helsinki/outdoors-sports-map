import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";
import { initReactI18next } from "react-i18next";

import { SUPPORTED_LANGUAGES } from "./i18nConstants";
import { replaceLanguageInPath } from "../../common/utils/pathUtils";
import { DEFAULT_LANG } from "../app/appConstants";
import history from "../app/appHistory";

const getTranslations = () => ({
  fi: {
    // eslint-disable-next-line global-require
    translation: require("./locales/fi.json"),
  },
  sv: {
    // eslint-disable-next-line global-require
    translation: require("./locales/sv.json"),
  },
  en: {
    // eslint-disable-next-line global-require
    translation: require("./locales/en.json"),
  },
});

const localesByName = getTranslations();
const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

function changeDocumentLanguage(nextLanguage: string) {
  document.documentElement.lang = nextLanguage;
}

// Configure language changed hook first so that it is fired on language
// initialization as well.
i18n.on("languageChanged", (nextLanguage) => {
  moment.locale(nextLanguage);
  changeDocumentLanguage(nextLanguage);
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      load: "languageOnly",
      whitelist: supportedLanguages,
      resources: localesByName,
      fallbackLng: DEFAULT_LANG,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["path", "localStorage", "navigator"],
        checkWhitelist: true,
      },
    },
    (err, t) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err, t);
      }
    },
  );

// replace language in url so that the pathname will reflect the current
// language when language is changed by using i18n.changeLanguage
// Replace language only when it is changed, not on initialization.
i18n.on("languageChanged", (nextLanguage) => {
  // If necessary, change language in pathname
  const { pathname, ...rest } = window.location;

  const containsLanguage = supportedLanguages.reduce(
    (contains, language) => contains || pathname.includes(`/${language}/`),
    false,
  );

  if (containsLanguage) {
    const nextPathname = replaceLanguageInPath(pathname, nextLanguage);

    history.replace({
      pathname: nextPathname,
      ...rest,
    });
  }
});

// Auto-detected language generally has a country code. Ignore it.
export const getCurrentLanguage = () => i18n.language.split("-")[0];

export default i18n;
