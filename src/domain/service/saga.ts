import values from "lodash/values";
import { schema } from "normalizr";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  callApi,
  createRequest,
  createUrl,
  normalizeEntityResults,
} from "../api/apiHelpers";
import { receiveServices, setFetchError } from "./actions";
import {
  ServiceActions,
  UnitServices,
  serviceSchema,
  Service,
  NormalizedService,
} from "./serviceConstants";

function* fetchServices() {
  const request = createRequest(
    createUrl("service/", {
      id: values(UnitServices),
      only: "id,name",
      page_size: 1000,
    })
  );

  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    const data = normalizeEntityResults<Service, NormalizedService, number[]>(
      bodyAsJson.results,
      new schema.Array(serviceSchema)
    );

    yield put(receiveServices(data));
  } else {
    yield put(setFetchError(bodyAsJson.results));
  }
}

function* watchFetchServices() {
  yield takeLatest(ServiceActions.FETCH, fetchServices);
}

export default function* saga() {
  yield all([fork(watchFetchServices)]);
}
