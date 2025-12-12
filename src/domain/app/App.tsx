import { Redirect, Route, Switch, RouteComponentProps } from "react-router-dom";

import LanguageAwareRoutes from "./AppLanguageAwareRoutes";
import AppWideNotification from "./appWideNotification/AppWideNotification";
import ResetFocus from "../../common/a11y/ResetFocus";
import useLanguage from "../../common/hooks/useLanguage";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import { languageParam } from "../i18n/i18nConstants";
import AppMeta from "../meta/AppMeta";
import LanguageMeta from "../meta/LanguageMeta";

function App() {
  useScrollToTop();

  const language = useLanguage();

  return (
    <div id="app-wrapper">
      <AppMeta />
      <LanguageMeta />
      <ResetFocus />
      <AppWideNotification />
      <Switch>
        <Route path={`/${languageParam}`} component={LanguageAwareRoutes} />
        <Route
          render={(props: RouteComponentProps) => (
            <Redirect to={`/${language}${props.location.pathname}`} />
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
