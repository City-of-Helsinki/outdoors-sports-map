import { createAction } from "redux-actions";

import { ApiResponse } from "../../api/apiConstants";
import { Action } from "../../app/appConstants";
import { getOnSeasonServices } from "../../service/serviceHelpers";
import { NormalizedUnitSchema, UnitActions } from "../unitConstants";

export const fetchUnits = (params: Record<string, any>): Action =>
  createAction(UnitActions.FETCH)({
    params,
  });

export const receiveUnits = (data: NormalizedUnitSchema): Action =>
  createAction(UnitActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) =>
  createAction(UnitActions.FETCH_ERROR)({
    error,
  });

export const clearSearch = () => createAction(UnitActions.SEARCH_CLEAR)();

export const searchUnits = (
  input: string,
  params: Record<string, any>,
): Action => {
  const init = {
    input,
    service: `${getOnSeasonServices().join(",")}`,
  };

  // eslint-disable-next-line no-param-reassign
  params = { ...init, ...params };

  return createAction(UnitActions.SEARCH_REQUEST)({
    params,
  });
};

export const fetchSearchSuggestions = (input: string): Action =>
  createAction(UnitActions.FETCH_SEARCH_SUGGESTIONS)({
    params: {
      input,
      service: `${getOnSeasonServices().join(",")}`,
      page_size: 5,
    },
  });

export const receiveSearchResults = (results: Array<Record<string, any>>) =>
  createAction(UnitActions.SEARCH_RECEIVE)(results);

export const receiveSearchSuggestions = (results: Array<Record<string, any>>) =>
  createAction(UnitActions.RECEIVE_SEARCH_SUGGESTIONS)(results);
