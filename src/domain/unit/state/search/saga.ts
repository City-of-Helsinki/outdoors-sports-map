import { schema } from "normalizr";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  receiveAddressSuggestions,
  receiveUnitSuggestions,
  receiveUnits,
} from "./actions";
import {
  callApi,
  createDigitransitUrl,
  createDigitransitRequest,
  createRequest,
  createUrl,
  normalizeEntityResults,
} from "../../../api/apiHelpers";
import { FetchAction } from "../../../app/appConstants";
import {
  Unit,
  NormalizedUnit,
  NormalizedUnitSchema,
  unitSchema,
  UnitSearchActions,
} from "../../unitConstants";
import { getFetchUnitsRequest } from "../../unitHelpers";

function* searchUnits({
  payload: { params },
}: FetchAction): Generator<any, any, any> {
  let data: NormalizedUnitSchema = { entities: { unit: {} }, result: [] };
  let request = null;

  // Make search request only when there's input
  if (params.input && params.input.length) {
    request = createRequest(createUrl("search/", params)); // Otherwise get all units in order to comply with accessibility
    // requirements
  } else {
    request = getFetchUnitsRequest(params);
  }

  const { bodyAsJson } = yield call(callApi, request);

  if (bodyAsJson.results) {
    data = normalizeEntityResults<Unit, NormalizedUnit, number[]>(
      bodyAsJson.results,
      new schema.Array(unitSchema),
    );
  }

  yield put(receiveUnits(data));
}

function* fetchUnitSuggestions({ payload: { params } }: FetchAction) {
  let data: NormalizedUnitSchema = { entities: { unit: {} }, result: [] };
  let addressData: Array<Record<string, any>> = [];

  const digitransitParams = {
    text: params.input,
    "boundary.rect.min_lat": 59.9,
    "boundary.rect.max_lat": 60.45,
    "boundary.rect.min_lon": 24.3,
    "boundary.rect.max_lon": 25.5,
    "focus.point.lat": 60.17,
    "focus.point.lon": 24.94,
    size: 5,
    lang: "fi",
  };

  // Make search request only when there's input
  if (params.input && params.input.length) {
    const request = createRequest(createUrl("search/", params));

    const addressRequest = createDigitransitRequest(
      createDigitransitUrl("search", digitransitParams),
    );

    const { bodyAsJson } = yield call(callApi, request);

    const { bodyAsJson: addressBodyAsJson } = yield call(
      callApi,
      addressRequest,
    );

    addressData = addressBodyAsJson
      ? addressBodyAsJson.features.filter(
          (feature: any) => feature.properties.layer !== "stop",
        )
      : [];

    addressData = [
      ...new Map(
        addressData.map((feature: any) => [feature.properties.label, feature]),
      ).values(),
    ];

    if (bodyAsJson.results) {
      data = normalizeEntityResults<Unit, NormalizedUnit, number[]>(
        bodyAsJson.results,
        new schema.Array(unitSchema),
      );
    }
  }

  yield put(receiveUnitSuggestions(data));
  yield put(receiveAddressSuggestions(addressData));
}

function* clearSearch() {
  // yield put(receiveSearchResults([]));
  yield put(receiveUnitSuggestions({ entities: { unit: {} }, result: [] }));
}

function* watchSearchUnits() {
  yield takeLatest(UnitSearchActions.FETCH_UNITS, searchUnits);
}

function* watchFetchUnitSuggestions() {
  yield takeLatest(
    UnitSearchActions.FETCH_UNIT_SUGGESTIONS,
    fetchUnitSuggestions,
  );
}

function* watchClearSearch() {
  yield takeLatest(UnitSearchActions.CLEAR, clearSearch);
}

export default function* saga(): Generator<any, any, any> {
  yield all([
    fork(watchSearchUnits),
    fork(watchFetchUnitSuggestions),
    fork(watchClearSearch),
  ]);
}
