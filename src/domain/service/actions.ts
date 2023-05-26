import { createAction } from "redux-actions";

import { Action } from "../../domain/app/appConstants";
import { ApiResponse } from "../api/apiConstants";
import { ServiceActions, NormalizedServiceSchema } from "./serviceConstants";

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
