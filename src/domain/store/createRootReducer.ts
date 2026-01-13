import { combineReducers } from "redux";

import { apiSlice } from "../api/apiSlice";
import mapReducer from "../map/state/mapSlice";
import searchReducer from "../unit/state/searchSlice";
import unitReducer from "../unit/state/unitSlice";

const createRootReducer = () =>
  combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    unit: unitReducer,
    map: mapReducer,
    search: searchReducer,
  });

export default createRootReducer;
