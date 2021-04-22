import { useTranslation } from "react-i18next";

function useLanguage() {
  // Use this value instead of i18n.language, because i18n.language always
  // contains the locale as well.
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return language;
}

export default useLanguage;
