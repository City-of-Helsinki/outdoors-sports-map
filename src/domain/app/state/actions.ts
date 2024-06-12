import { createAction } from "redux-actions";

import { normalizeActionName } from "../../utils";

export const AppActions = {
  SEND_FEEDBACK: normalizeActionName("app/SEND_FEEDBACK"),
};

export const sendFeedback = (
  feedback: string,
  email: string | null | undefined,
) =>
  createAction(AppActions.SEND_FEEDBACK)({
    feedback,
    email,
  });
