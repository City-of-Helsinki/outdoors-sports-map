import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router-dom';

import HomeContainer from '../../home/components/HomeContainer';
import { routerPaths } from '../constants';
import TranslationProvider from './translation/TranslationProvider';
import JumpLink from './JumpLink';

const App = ({ history }) => (
  <TranslationProvider>
    <div id="app-wrapper">
      <JumpLink />
      <Router history={history}>
        <Route path="/" exact component={HomeContainer} />
        <Route path={routerPaths.singleUnit} exact component={HomeContainer} />
      </Router>
    </div>
  </TranslationProvider>
);

App.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default App;
