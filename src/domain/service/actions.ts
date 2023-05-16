import { createAction } from "redux-actions";

import { ServiceActions, NormalizedServiceSchema } from "./serviceConstants";
import { Action } from "../../domain/app/appConstants";
import { ApiResponse } from "../api/apiConstants";

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
