import { schema } from "normalizr";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  callApi,
  createRequest,
  normalizeEntityResults,
  stringifyQuery,
} from "../../api/apiHelpers";
import { FetchAction, Action } from "../../app/appConstants";
import {
  NormalizedUnit,
  Unit,
  UnitActions,
  unitSchema,
} from "../unitConstants";
import { getFetchUnitsRequest } from "../unitHelpers";
import {
  receiveSearchSuggestions,
  receiveUnits,
  setFetchError,
} from "./actions";

function* fetchUnits({ payload: { params } }: FetchAction) {
  const request = getFetchUnitsRequest(params);
  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    const data = normalizeEntityResults<Unit, NormalizedUnit, number[]>(
      bodyAsJson.results,
      new schema.Array(unitSchema)
    );

    yield put(receiveUnits(data));
  } else {
    yield put(setFetchError(bodyAsJson.results));
  }
}

function* clearSearch() {
  // yield put(receiveSearchResults([]));
  yield put(receiveSearchSuggestions([]));
}

function* sendFeedback({ payload: { feedback, email } }: Action) {
  const params = {
    description: feedback,
    service_request_type: "OTHER",
    can_be_published: false,
    internal_feedback: true,
    service_code: 2815,
    email: undefined,
  };

  if (email) {
    params.email = email;
  }

  const request = createRequest("https://api.hel.fi/servicemap/open311/", {
    method: "POST",
    body: stringifyQuery(params),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  yield call(callApi, request);
}

function* watchFetchUnits() {
  yield takeLatest(UnitActions.FETCH, fetchUnits);
}

function* watchClearSearch() {
  yield takeLatest(UnitActions.SEARCH_CLEAR, clearSearch);
}

function* watchSendFeedback() {
  yield takeLatest(UnitActions.SEND_FEEDBACK, sendFeedback);
}

export default function* saga(): any {
  yield all([
    fork(watchFetchUnits),
    fork(watchClearSearch),
    fork(watchSendFeedback),
  ]);
}
