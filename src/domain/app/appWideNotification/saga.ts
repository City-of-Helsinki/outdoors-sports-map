import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { receiveAppWideNotifications, setFetchError } from "./actions";
import { AppWideNotificationActions } from "./appWideNotificationConstants";
import { callApi, createRequest, createUrl } from "../../api/apiHelpers";

function* fetchAppWideNotifications() {
  const request = createRequest(
    createUrl("announcement/", {
      outdoor_sports_map_usage: 1,
    }),
  );

  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    yield put(receiveAppWideNotifications(bodyAsJson.results));
  } else {
    yield put(setFetchError(bodyAsJson.results));
  }
}

function* watchFetchAppWideNotifications() {
  yield takeLatest(AppWideNotificationActions.FETCH, fetchAppWideNotifications);
}

export default function* saga() {
  yield all([fork(watchFetchAppWideNotifications)]);
}
