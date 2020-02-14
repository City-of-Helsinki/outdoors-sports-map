import { applyMiddleware, compose, createStore as rawCreateStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import createRootReducer from './createRootReducer';
import rootSaga from './rootSaga';
import { APP_NAME } from '../modules/common/constants';

/**
 * @returns {function}
 */
const createStore = () =>
  new Promise((resolve) => {
    const persistConfig = {
      key: 'primary',
      storage,
      whitelist: ['language', 'map'],
      blacklist: [],
      keyPrefix: `${APP_NAME}:`,
    };

    const rootReducer = createRootReducer();
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const middlewares = [];
    const sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);

    const enhancer = compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    );

    const store = rawCreateStore(persistedReducer, enhancer);

    // The promise returned by "createStore" will be resolved once we have re-hydrated the state.
    persistStore(store, null, () => resolve(store));

    sagaMiddleware.run(rootSaga);
  });

export default createStore;
