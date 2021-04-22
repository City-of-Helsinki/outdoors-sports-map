import { all, fork } from "redux-saga/effects";

import mapSaga from "../map/state/saga";
import serviceSaga from "../service/saga";
import unitSaga from "../unit/state/saga";
import searchSaga from "../unit/state/search/saga";

export default function* rootSaga() {
  yield all([
    fork(unitSaga),
    fork(searchSaga),
    fork(mapSaga),
    fork(serviceSaga),
  ]);
}