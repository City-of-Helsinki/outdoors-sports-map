import PropTypes from "prop-types";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";

import createStore from "../../../bootstrap/createStore";
import App from "./App";
import TranslationProvider from "./translation/TranslationProvider";

const { persistor, store } = createStore();

function Root({ history }) {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TranslationProvider>
        <Router history={history}>
          <App />
        </Router>
      </TranslationProvider>
    </PersistGate>
  </Provider>
}

Root.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Root;
