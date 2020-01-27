import { takeLatest } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { arrayOf } from 'normalizr';
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
    const data = normalizeEntityResults(bodyAsJson.results, arrayOf(serviceSchema));
    yield put(receiveServices(data));
  } else {
    yield put(setFetchError(bodyAsJson.results));
  }
}

function* watchFetchServices() {
  yield takeLatest(ServiceActions.FETCH, fetchServices);
}

export default function* saga() {
  return [
    yield fork(watchFetchServices),
  ];
}
