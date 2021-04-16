import values from "lodash/values";
import { createAction } from "redux-actions";

import type { Action } from "../common/constants";
import { UnitServices } from "../service/constants";
import { NormalizedUnitSchema } from "../unit/constants";
import { MAX_SUGGESTION_COUNT, SearchActions } from "./constants";

export const clearSearch = () => createAction(SearchActions.CLEAR)();

export const searchUnits = (
  input: string,
  params: Record<string, any> = {}
): Action => {
  const init = {
    input,
    service: `${values(UnitServices).join(",")}`,
  };

  // eslint-disable-next-line no-param-reassign
  params = { ...init, ...params };

  return createAction(SearchActions.FETCH_UNITS)({
    params,
  });
};

export const receiveUnits = (results: NormalizedUnitSchema) =>
  createAction(SearchActions.RECEIVE_UNITS)(results);

export const fetchUnitSuggestions = (input: string): Action =>
  createAction(SearchActions.FETCH_UNIT_SUGGESTIONS)({
    params: {
      input,
      service: `${values(UnitServices).join(",")}`,
      page_size: MAX_SUGGESTION_COUNT,
    },
  });

export const receiveUnitSuggestions = (results: NormalizedUnitSchema) =>
  createAction(SearchActions.RECEIVE_UNIT_SUGGESTIONS)(results);

export const receiveAddressSuggestions = (
  results: Array<Record<string, any>>
) => createAction(SearchActions.RECEIVE_ADDRESS_SUGGESTIONS)(results);
