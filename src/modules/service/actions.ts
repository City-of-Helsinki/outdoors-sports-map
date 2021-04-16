import { createAction } from "redux-actions";

import { ApiResponse } from "../api/constants";
import { Action } from "../common/constants";
import { ServiceActions, NormalizedServiceSchema } from "./constants";

export const fetchServices = (params: Record<string, any>): Action =>
  createAction(ServiceActions.FETCH)({
    params,
  });

export const receiveServices = (data: NormalizedServiceSchema): Action =>
  createAction(ServiceActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) =>
  createAction(ServiceActions.FETCH_ERROR)({
    error,
  });
