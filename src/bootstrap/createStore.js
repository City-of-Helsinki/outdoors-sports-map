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
const createStore = () => {
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
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};

export default createStore;
