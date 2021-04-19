// @flow

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { languageParam } from '../../language/constants';
import AppMeta from '../../meta/AppMeta';
import LanguageMeta from '../../meta/LanguageMeta';
import useScrollToTop from '../hooks/useScrollToTop';
import JumpLink from './JumpLink';
import ResetFocus from './ResetFocus';
import LanguageAwareRoutes from './LanguageAwareRoutes';

const App = () => {
  useScrollToTop();

  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <div id="app-wrapper">
      <AppMeta />
      <LanguageMeta />
      <ResetFocus />
      <JumpLink />
      <Switch>
        <Route path={`/${languageParam}`} component={LanguageAwareRoutes} />
        <Route
          render={(props: ContextRouter) => (
            <Redirect to={`/${language}${props.location.pathname}`} />
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
