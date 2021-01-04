import React from 'react';
import { Provider } from 'react-redux';
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

// eslint-disable-next-line react/prop-types
const App = ({ store, history }) => (
  <Provider store={store}>
    <TranslationProvider>
      <div id="app-wrapper">
        <JumpLink />
        <Router history={history} routes={routes} key={Math.random()} />
      </div>
    </TranslationProvider>
  </Provider>
);

export default App;
