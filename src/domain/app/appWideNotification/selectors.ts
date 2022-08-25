import isEmpty from "lodash/isEmpty";

import type { AppState } from "../../../domain/app/appConstants";

export const getData = (state: AppState) => state.appWideNotification.data;

export const getAppWideNotificationsObject = (state: AppState) =>
  state.appWideNotification;

export const getIsFetchingAppWideNotification = (state: AppState) =>
  state.appWideNotification.isFetching;

export const getIsLoading = (state: AppState) =>
  state.appWideNotification.isFetching &&
  isEmpty(state.appWideNotification.data);
