import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Router } from 'react-router-dom';

import createStore from '../../../bootstrap/createStore';
import TranslationProvider from './translation/TranslationProvider';
import App from './App';

const { persistor, store } = createStore();

const Root = ({ history }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TranslationProvider>
        <Router history={history}>
          <App />
        </Router>
      </TranslationProvider>
    </PersistGate>
  </Provider>
);

Root.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Root;
