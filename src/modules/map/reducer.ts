import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import type { Action, Address } from "../common/constants";
import { locations } from "../home/constants";
import { mapActions } from "./constants";

const centerReducer = handleActions(
  {
    [mapActions.SET_LOCATION]: (
      state: [number, number],
      { payload: { position } }: Action
    ) => position,
  },
  locations.HELSINKI
);

const addressReducer = handleActions(
  {
    [mapActions.RECEIVE_ADDRESS]: (
      state: Address | null | undefined,
      { payload: { address } }: Action
    ) => address || {},
  },
  null
);

const reducer = combineReducers({
  location: centerReducer,
  address: addressReducer,
});

export default reducer;
