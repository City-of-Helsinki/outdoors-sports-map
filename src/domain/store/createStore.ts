import { configureStore as rawConfigureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";

import createRootReducer from "./createRootReducer";
import rootSaga from "./rootSaga";
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
        const { service, ...rest } = state;
        return Promise.resolve(rest);
      }
      return Promise.resolve(state);
    },
  };

  const rootReducer = createRootReducer();
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const sagaMiddleware = createSagaMiddleware();

  const store = rawConfigureStore({
    reducer: persistedReducer as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(apiSlice.middleware, sagaMiddleware) as any,
    preloadedState,
  });

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return {
    store,
    persistor,
  };
};

export default createStore;
