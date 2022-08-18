import { schema } from "normalizr";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  callApi,
  createRequest,
  createUrl,
  normalizeEntityResults,
} from "../../api/apiHelpers";
import { receiveAppWideNotifications, setFetchError } from "./actions";
import {
  AppWideNotificationActions,
  // appWideNotificationSchema,
  // AppWideNotification,
  // NormalizedAppWideNotification,
} from "./appWideNotificationConstants";

function* fetchAppWideNotifications() {
  const request = createRequest(
    createUrl("announcement/", {
      outdoor_sports_map_usage: 1,
      page_size: 1000,
    })
  );

  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    // const data = normalizeEntityResults<AppWideNotification, NormalizedAppWideNotification, number[]>(
    //   bodyAsJson.results,
    //   new schema.Array(appWideNotificationSchema)
    // );

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
