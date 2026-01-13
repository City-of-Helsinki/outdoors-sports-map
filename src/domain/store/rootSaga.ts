import { all, fork } from "redux-saga/effects";

import unitSaga from "../unit/state/saga";
import searchSaga from "../unit/state/search/saga";

export default function* rootSaga() {
  yield all([
    fork(unitSaga),
    fork(searchSaga),
  ]);
}
