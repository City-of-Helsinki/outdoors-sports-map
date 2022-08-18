import isEmpty from "lodash/isEmpty";

import type { AppState } from "../../../domain/app/appConstants";

export const getAppWideNotificationById = (state: AppState, appWideNotificationId: string) =>
  state.appWideNotification.byId[appWideNotificationId];

export const getAll = (state: AppState) =>
  /* , props: Object */
  state.appWideNotification.all.map((appWideNotificationId) => getAppWideNotificationById(state, appWideNotificationId));

export const getAppWideNotificationsObject = (state: AppState) => state.appWideNotification;

export const getIsFetchingAppWideNotification = (state: AppState) =>
  state.appWideNotification.isFetching;

export const getIsLoading = (state: AppState) =>
  state.appWideNotification.isFetching && isEmpty(state.appWideNotification.all);
