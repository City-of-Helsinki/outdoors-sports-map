import { LatLngTuple } from "leaflet";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { Action, Address } from "../../app/appConstants";
import { locations } from "../../home/homeConstants";
import { mapActions } from "../mapConstants";

const centerReducer = handleActions(
  {
    [mapActions.SET_LOCATION]: (
      state: LatLngTuple,
      { payload: { position } }: Action,
    ) => position,
  },
  locations.HELSINKI,
);

const addressReducer = handleActions(
  {
    [mapActions.RECEIVE_ADDRESS]: (
      state: Address | null | undefined,
      { payload: { address } }: Action,
    ) => address || {},
  },
  null,
);

const reducer = combineReducers({
  location: centerReducer,
  address: addressReducer,
});

export default reducer;
