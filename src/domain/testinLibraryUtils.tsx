import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactElement } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { AppState } from "./app/appConstants";
import createStore from "./bootstrap/createStore";
import TranslationProvider from "./i18n/I18nTranslationProvider";

type Props = {
  children: React.ReactNode;
  preloadedState?: Partial<AppState>;
};

export function TestProviders({ preloadedState, children }: Props) {
  // @ts-ignore
  const { store } = createStore(preloadedState);

  return (
    <Provider store={store}>
      <TranslationProvider>
        <MemoryRouter>
          <HelmetProvider>{children}</HelmetProvider>
        </MemoryRouter>
      </TranslationProvider>
    </Provider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
  preloadedState?: Partial<AppState>
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProviders preloadedState={preloadedState}>{children}</TestProviders>
    ),
    ...options,
  });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

export { userEvent };
