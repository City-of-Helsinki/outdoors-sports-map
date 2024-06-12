import { createAction } from "redux-actions";

import {
  AppWideNotificationActions,
  AppWideNotificationObject,
} from "./appWideNotificationConstants";
import { Action } from "../../../domain/app/appConstants";
import { ApiResponse } from "../../api/apiConstants";

export const fetchAppWideNotifications = (
  params: Record<string, any>,
): Action =>
  createAction(AppWideNotificationActions.FETCH)({
    params,
  });

export const receiveAppWideNotifications = (
  data: Array<AppWideNotificationObject>,
): Action => createAction(AppWideNotificationActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) =>
  createAction(AppWideNotificationActions.FETCH_ERROR)({
    error,
  });
