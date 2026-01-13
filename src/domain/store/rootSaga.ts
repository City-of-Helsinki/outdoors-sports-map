import { all, fork } from "redux-saga/effects";

import appWideNotificationSaga from "../app/appWideNotification/saga";
import appSaga from "../app/state/saga";
import mapSaga from "../map/state/saga";
import serviceSaga from "../service/saga";
import unitSaga from "../unit/state/saga";
import searchSaga from "../unit/state/search/saga";

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(unitSaga),
    fork(searchSaga),
    fork(mapSaga),
    fork(serviceSaga),
    fork(appWideNotificationSaga),
  ]);
}
