import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, useRouteMatch } from "react-router-dom";

import useLanguage from "../../common/hooks/useLanguage";
import HomeContainer from "../home/HomeContainer";
import { languageParam } from "../i18n/i18nConstants";

function getRouteLanguage(match: Record<string, any> | null | undefined) {
  if (!match) {
    return null;
  }

  return match.params.language;
}

function LanguageAwareRoutes() {
  const { i18n } = useTranslation();
  const language = useLanguage();

  const match = useRouteMatch();
  const routeLanguage = getRouteLanguage(match);

  useEffect(() => {
    // Sync language with i18next in case it is changed by changing the url
    if (language !== routeLanguage) {
      i18n.changeLanguage(routeLanguage);
    }
  }, [routeLanguage, language, i18n]);

  return <Route path={`/${languageParam}`} component={HomeContainer} />;
}

export default LanguageAwareRoutes;
