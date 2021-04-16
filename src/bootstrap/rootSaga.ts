import { all, fork } from "redux-saga/effects";

import mapSaga from "../modules/map/saga";
import searchSaga from "../modules/search/saga";
import serviceSaga from "../modules/service/saga";
import unitSaga from "../modules/unit/saga";

export default function* rootSaga() {
  yield all([
    fork(unitSaga),
    fork(searchSaga),
    fork(mapSaga),
    fork(serviceSaga),
  ]);
}
