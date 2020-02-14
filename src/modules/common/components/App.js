import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute } from 'react-router';
import HomeContainer from '../../home/components/HomeContainer';
import { routerPaths } from '../constants';
import TranslationProvider from './translation/TranslationProvider';
import JumpLink from './JumpLink';

const routes = (
  <Route path="/">
    <IndexRoute component={HomeContainer} />
    <Route path={routerPaths.singleUnit} component={HomeContainer} />
  </Route>
);

const App = ({ history }) => (
  <TranslationProvider>
    <div id="app-wrapper">
      <JumpLink />
      <Router history={history} routes={routes} key={Math.random()} />
    </div>
  </TranslationProvider>
);

App.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default App;
