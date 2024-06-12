import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { EntityAction } from "../../../app/appConstants";
import { UnitSearchActions } from "../../unitConstants";

const isFetching = handleActions(
  {
    [UnitSearchActions.FETCH_UNITS]: () => true,
    [UnitSearchActions.RECEIVE_UNITS]: () => false,
  },
  false,
);

const isActive = handleActions(
  {
    [UnitSearchActions.RECEIVE_UNITS]: () => true,
    [UnitSearchActions.CLEAR]: () => false,
  },
  false,
);

const unitResults = handleActions(
  {
    [UnitSearchActions.RECEIVE_UNITS]: (
      state: string[],
      { payload: { result } }: EntityAction,
    ) => result,
    [UnitSearchActions.CLEAR]: () => [],
  },
  [],
);

const unitSuggestions = handleActions(
  {
    [UnitSearchActions.RECEIVE_UNIT_SUGGESTIONS]: (
      state: string[],
      { payload: { result } }: EntityAction,
    ) => result,
    [UnitSearchActions.RECEIVE_UNITS]: () => [],
    [UnitSearchActions.CLEAR]: () => [],
  },
  [],
);

const addressSuggestions = handleActions(
  {
    [UnitSearchActions.RECEIVE_ADDRESS_SUGGESTIONS]: (
      state: Record<string, any>[],
      { payload: results },
    ) => results || [],
    [UnitSearchActions.CLEAR]: () => [],
  },
  [],
);

const reducer = combineReducers({
  isFetching,
  isActive,
  unitResults,
  unitSuggestions,
  addressSuggestions,
});

export default reducer;
