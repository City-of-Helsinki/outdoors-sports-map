import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { receiveAddress } from "./actions";
import { callApi, createRequest, createUrl } from "../../api/apiHelpers";
import type { PositionAction } from "../../domain/../app/appConstants";
import { mapActions } from "../mapConstants";

function* onSetLocation({
  payload: { position },
}: PositionAction): Generator<any, any, any> {
  const addressParams = {
    lat: position[0],
    lon: position[1],
    page_size: 1,
  };

  const addressRequest = createRequest(createUrl("address/", addressParams));
  const { bodyAsJson: addressJson } = yield call(callApi, addressRequest);
  const addressData = addressJson.results ? addressJson.results[0] : null;

  yield put(receiveAddress(addressData));
}

function* watchSetLocation() {
  yield takeLatest(mapActions.SET_LOCATION, onSetLocation);
}

export default function* saga(): Generator<any, any, any> {
  yield all([fork(watchSetLocation)]);
}
