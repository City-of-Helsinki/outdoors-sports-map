import { useEffect } from "react";
import { Route, useRouteMatch } from "react-router-dom";

import useLanguage from "../../common/hooks/useLanguage";
import { replaceLanguageInPath } from "../../common/utils/pathUtils";
import HomeContainer from "../home/HomeContainer";
import { languageParam } from "../i18n/i18nConstants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRouteLanguage(match: Record<string, any> | null | undefined) {
  if (!match) {
    return null;
  }

  return match.params.language;
}

function LanguageAwareRoutes() {
  const language = useLanguage();

  const match = useRouteMatch();
  const routeLanguage = getRouteLanguage(match);

  useEffect(() => {
    // When the URL language differs from the active language (e.g. browser
    // back/forward across language versions), do a full page reload so the
    // browser receives the page with the correct lang attribute from the start.
    if (routeLanguage && language !== routeLanguage) {
      globalThis.location.replace(replaceLanguageInPath(globalThis.location.pathname, routeLanguage));
    }
  }, [routeLanguage, language]);

  return <Route path={`/${languageParam}`} component={HomeContainer} />;
}

export default LanguageAwareRoutes;
