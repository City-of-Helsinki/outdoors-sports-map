import { all, call, fork, takeLatest } from "redux-saga/effects";

import { callApi, createRequest, stringifyQuery } from "../../api/apiHelpers";
import { Action } from "../../app/appConstants";
import { AppActions } from "../state/actions";

function* sendFeedback({ payload: { feedback, email } }: Action) {
  const params = {
    description: feedback,
    service_request_type: "OTHER",
    can_be_published: false,
    internal_feedback: true,
    service_code: 2807,
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

function* watchSendFeedback() {
  yield takeLatest(AppActions.SEND_FEEDBACK, sendFeedback);
}

export default function* saga(): any {
  yield all([fork(watchSendFeedback)]);
}
