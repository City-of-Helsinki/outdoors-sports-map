import { useTranslation } from "react-i18next";

import { Language } from "../../types";

const useLocale = (): Language => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  switch (language) {
    case "en":
    case "fi":
    case "sv":
      return language;
    default:
      return "fi";
  }
};

export default useLocale;
