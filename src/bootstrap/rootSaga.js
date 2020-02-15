import { all, fork } from 'redux-saga/effects';
import unitSaga from '../modules/unit/saga';
import searchSaga from '../modules/search/saga';
import mapSaga from '../modules/map/saga';
import serviceSaga from '../modules/service/saga';

export default function* rootSaga() {
  yield all([
    fork(unitSaga),
    fork(searchSaga),
    fork(mapSaga),
    fork(serviceSaga),
  ]);
}
