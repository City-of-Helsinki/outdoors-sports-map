import { all, fork } from "redux-saga/effects";

import searchSaga from "../unit/state/search/saga";

export default function* rootSaga() {
  yield all([
    fork(searchSaga),
  ]);
}
