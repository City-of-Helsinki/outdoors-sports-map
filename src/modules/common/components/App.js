import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute } from 'react-router';
import HomeContainer from '../../home/components/HomeContainer';
import TranslationProvider from './translation/TranslationProvider';
import { routerPaths } from '../constants';

const routes = (
  <Route path="/">
    <IndexRoute component={HomeContainer} />
    <Route path={routerPaths.singleUnit} component={HomeContainer} />
  </Route>
);

const App = ({ history }) => (
  <TranslationProvider>
    <Router history={history} routes={routes} key={Math.random()} />
  </TranslationProvider>
);

App.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default App;
