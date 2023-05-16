import { History } from "history";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";

import App from "./App";
import createStore from "../bootstrap/createStore";
import TranslationProvider from "../i18n/I18nTranslationProvider";

const { persistor, store } = createStore();

type Props = {
  history: History;
};

function Root({ history }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TranslationProvider>
          <Router history={history}>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </Router>
        </TranslationProvider>
      </PersistGate>
    </Provider>
  );
}

export default Root;
