import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import type { EntityAction } from "../common/constants";
import { SearchActions } from "./constants";

const isFetching = handleActions(
  {
    [SearchActions.FETCH_UNITS]: () => true,
    [SearchActions.RECEIVE_UNITS]: () => false,
  },
  false
);

const isActive = handleActions(
  {
    [SearchActions.RECEIVE_UNITS]: () => true,
    [SearchActions.CLEAR]: () => false,
  },
  false
);

const unitResults = handleActions(
  {
    [SearchActions.RECEIVE_UNITS]: (
      state: string[],
      { payload: { result } }: EntityAction
    ) => result,
    [SearchActions.CLEAR]: () => [],
  },
  []
);

const unitSuggestions = handleActions(
  {
    [SearchActions.RECEIVE_UNIT_SUGGESTIONS]: (
      state: string[],
      { payload: { result } }: EntityAction
    ) => result,
    [SearchActions.RECEIVE_UNITS]: () => [],
    [SearchActions.CLEAR]: () => [],
  },
  []
);

const addressSuggestions = handleActions(
  {
    [SearchActions.RECEIVE_ADDRESS_SUGGESTIONS]: (
      state: Record<string, any>[],
      { payload: results }
    ) => results || [],
    [SearchActions.CLEAR]: () => [],
  },
  []
);

const reducer = combineReducers({
  isFetching,
  isActive,
  unitResults,
  unitSuggestions,
  addressSuggestions,
});

export default reducer;
