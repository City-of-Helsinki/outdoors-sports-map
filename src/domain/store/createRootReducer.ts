import { combineReducers } from "redux";

import { apiSlice } from "../api/apiSlice";
import mapReducer from "../map/mapSlice";
import searchReducer from "../unit/state/search/searchSlice";
import unitReducer from "../unit/unitSlice";

const createRootReducer = () =>
  combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    unit: unitReducer,
    map: mapReducer,
    search: searchReducer,
  });

export default createRootReducer;
