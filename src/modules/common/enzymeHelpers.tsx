import { mount as enzymeMount } from "enzyme";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import createStore from "../../bootstrap/createStore";
import TranslationProvider from "./components/translation/TranslationProvider";

// eslint-disable-next-line import/prefer-default-export
export const mount = (element, options) => {
  const { store } = createStore();

  return enzymeMount(
    <Provider store={store}>
      <TranslationProvider>
        <MemoryRouter>{element}</MemoryRouter>
      </TranslationProvider>
    </Provider>,
    options
  );
};
