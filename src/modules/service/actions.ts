import { createAction } from "redux-actions";

import type { ApiResponse } from "../api/constants";
import type { Action } from "../common/constants";
import { ServiceActions } from "./constants";

export const fetchServices = (params: Record<string, any>): Action =>
  createAction(ServiceActions.FETCH)({
    params,
  });

export const receiveServices = (data: ApiResponse): Action =>
  createAction(ServiceActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) =>
  createAction(ServiceActions.FETCH_ERROR)({
    error,
  });
