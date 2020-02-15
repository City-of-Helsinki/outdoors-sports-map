import {
  all, call, fork, takeLatest, put,
} from 'redux-saga/effects';
import { schema } from 'normalizr';
import values from 'lodash/values';
import { receiveServices, setFetchError } from './actions';
import { ServiceActions, serviceSchema, UnitServices } from './constants';
import {
  createRequest, createUrl, callApi, normalizeEntityResults,
} from '../api/helpers';

function* fetchServices() {
  const request = createRequest(createUrl('service/', {
    id: values(UnitServices),
    only: 'id,name',
    page_size: 1000,
  }));
  const { response, bodyAsJson } = yield call(callApi, request);

  if (response.status === 200) {
    const data = normalizeEntityResults(bodyAsJson.results, new schema.Array(serviceSchema));
    yield put(receiveServices(data));
  } else {
    yield put(setFetchError(bodyAsJson.results));
  }
}

function* watchFetchServices() {
  yield takeLatest(ServiceActions.FETCH, fetchServices);
}

export default function* saga() {
  yield all([
    fork(watchFetchServices),
  ]);
}
