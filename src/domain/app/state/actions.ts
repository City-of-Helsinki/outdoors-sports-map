import { createAction } from "redux-actions";

import { AppActions } from "../appConstants";

export const sendFeedback = (
  feedback: string,
  email: string | null | undefined
) =>
  createAction(AppActions.SEND_FEEDBACK)({
    feedback,
    email,
  });
