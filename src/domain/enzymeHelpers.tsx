import { mount as enzymeMount, MountRendererProps } from "enzyme";
import get from "lodash/get";
import omit from "lodash/omit";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { AppState } from "./app/appConstants";
import createStore from "./bootstrap/createStore";
import TranslationProvider from "./i18n/I18nTranslationProvider";

type Options = MountRendererProps & { preloadedState: Partial<AppState> };

export const mount = (element: ReactNode, options?: Options) => {
  const enzymeOptions = omit(options, "preloadedState");
  const preloadedState = get(options, "preloadedState");
  // @ts-ignore
  const { store } = createStore(preloadedState);

  return enzymeMount(
    <Provider store={store}>
      <TranslationProvider>
        <MemoryRouter>{element}</MemoryRouter>
      </TranslationProvider>
    </Provider>,
    enzymeOptions
  );
};
