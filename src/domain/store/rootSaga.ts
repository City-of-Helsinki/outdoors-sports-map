import { all, fork } from "redux-saga/effects";

import appSaga from "../app/state/saga";
import unitSaga from "../unit/state/saga";
import searchSaga from "../unit/state/search/saga";

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(unitSaga),
    fork(searchSaga),
  ]);
}
