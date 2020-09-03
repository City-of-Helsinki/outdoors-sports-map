// @flow
import { takeLatest } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { receiveAddress } from './actions';
import { mapActions } from './constants';
import { createUrl, createRequest, callApi } from '../api/helpers';
import type { FetchAction } from '../common/constants';

function* onSetLocation({ payload: position }: FetchAction): Generator<any, void, void> {
  const addressParams = {
    lat: position[0],
    lon: position[1],
    page_size: 1,
  };
  const addressRequest = createRequest(createUrl('address/', addressParams));
  // $FlowFixMe
  const { bodyAsJson: addressJson } = yield call(callApi, addressRequest);
  const addressData = addressJson.results ? addressJson.results[0] : null;
  yield put(receiveAddress(addressData));
}

function* watchSetLocation() {
  yield takeLatest(mapActions.SET_LOCATION, onSetLocation);
}

export default function* saga(): Generator<*, *, *> {
  return [
    yield fork(watchSetLocation),
  ];
}
