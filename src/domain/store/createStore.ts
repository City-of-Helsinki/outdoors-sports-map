/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore as rawConfigureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import createRootReducer from "./createRootReducer";
import { apiSlice } from "../api/apiSlice";
import { APP_NAME } from "../app/appConstants";

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export type RootAction = Parameters<ReturnType<typeof createRootReducer>>[1];

const createStore = (preloadedState?: RootState) => {
  const persistConfig = {
    key: "primary",
    storage,
    whitelist: ["map"],
    blacklist: ["api"], // Don't persist RTK Query cache
    keyPrefix: `${APP_NAME}:`,
    version: 1, // Increment version to clear old persisted state with "service" key
    migrate: (state: any) => {
      // Remove old "service" key from persisted state
      if (state && state.service) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { service, ...rest } = state;
        return Promise.resolve(rest);
      }
      return Promise.resolve(state);
    },
  };

  const rootReducer = createRootReducer();
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = rawConfigureStore({
    reducer: persistedReducer as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
        immutableCheck: {
          // Ignore large state paths that are managed by RTK Query
          ignoredPaths: ["api.queries", "api.mutations", "unit.byId"],
          warnAfter: 128, // Increase threshold from 32ms to 128ms
        },
      }).concat(apiSlice.middleware) as any,
    preloadedState,
  });

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

export default createStore;
