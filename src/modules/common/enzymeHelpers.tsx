import { mount as enzymeMount, MountRendererProps } from "enzyme";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import createStore from "../../bootstrap/createStore";
import TranslationProvider from "./components/translation/TranslationProvider";

export const mount = (element: ReactNode, options?: MountRendererProps) => {
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
