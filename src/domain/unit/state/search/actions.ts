import { createAction } from "redux-actions";

import { Action } from "../../../app/appConstants";
import { getOnSeasonServices } from "../../../service/serviceHelpers";
import { NormalizedUnitSchema } from "../../../unit/unitConstants";
import { MAX_SUGGESTION_COUNT, UnitSearchActions } from "../../unitConstants";

export const clearSearch = () => createAction(UnitSearchActions.CLEAR)();

export const searchUnits = (
  input: string,
  params: Record<string, any> = {},
): Action => {
  const init = {
    input,
    service: `${getOnSeasonServices().join(",")}`,
    type: "unit",
  };

  // eslint-disable-next-line no-param-reassign
  params = { ...init, ...params };

  return createAction(UnitSearchActions.FETCH_UNITS)({
    params,
  });
};

export const receiveUnits = (results: NormalizedUnitSchema) =>
  createAction(UnitSearchActions.RECEIVE_UNITS)(results);

export const fetchUnitSuggestions = (input: string): Action =>
  createAction(UnitSearchActions.FETCH_UNIT_SUGGESTIONS)({
    params: {
      input,
      service: `${getOnSeasonServices().join(",")}`,
      page_size: MAX_SUGGESTION_COUNT,
      type: "unit",
    },
  });

export const receiveUnitSuggestions = (results: NormalizedUnitSchema) =>
  createAction(UnitSearchActions.RECEIVE_UNIT_SUGGESTIONS)(results);

export const receiveAddressSuggestions = (
  results: Array<Record<string, any>>,
) => createAction(UnitSearchActions.RECEIVE_ADDRESS_SUGGESTIONS)(results);
