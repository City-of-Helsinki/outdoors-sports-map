// @flow
import { all, call, fork, takeLatest, put } from 'redux-saga/effects';

import { createUrl, createRequest, callApi } from '../api/helpers';
import type { PositionAction } from '../common/constants';
import { receiveAddress } from './actions';
import { mapActions } from './constants';

function* onSetLocation({
  payload: { position },
}: PositionAction): Generator<*, *, *> {
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
  yield all([fork(watchSetLocation)]);
}
