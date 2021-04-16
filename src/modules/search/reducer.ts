import keys from "lodash/keys";
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
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => (entities ? [...keys(entities.unit)] : []),
    [SearchActions.CLEAR]: () => [],
  },
  []
);

const unitSuggestions = handleActions(
  {
    [SearchActions.RECEIVE_UNIT_SUGGESTIONS]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => (entities ? [...keys(entities.unit)] : []),
    [SearchActions.RECEIVE_UNITS]: () => [],
    [SearchActions.CLEAR]: () => [],
  },
  []
);

const addressSuggestions = handleActions(
  {
    [SearchActions.RECEIVE_ADDRESS_SUGGESTIONS]: (
      state: Record<string, any>,
      { payload: results }: EntityAction
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
