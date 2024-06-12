import { schema } from "normalizr";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  receiveSearchSuggestions,
  receiveUnits,
  setFetchError,
} from "./actions";
import { callApi, normalizeEntityResults } from "../../api/apiHelpers";
import { FetchAction } from "../../app/appConstants";
import {
  NormalizedUnit,
  Unit,
  UnitActions,
  unitSchema,
} from "../unitConstants";
import { getFetchUnitsRequest } from "../unitHelpers";

function* fetchUnits({ payload: { params } }: FetchAction) {
  const request = getFetchUnitsRequest(params);
  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    const data = normalizeEntityResults<Unit, NormalizedUnit, number[]>(
      bodyAsJson.results,
      new schema.Array(unitSchema),
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

function* watchFetchUnits() {
  yield takeLatest(UnitActions.FETCH, fetchUnits);
}

function* watchClearSearch() {
  yield takeLatest(UnitActions.SEARCH_CLEAR, clearSearch);
}

export default function* saga(): any {
  yield all([fork(watchFetchUnits), fork(watchClearSearch)]);
}
