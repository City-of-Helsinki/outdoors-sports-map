import { combineReducers } from "redux";

import { apiSlice } from "../api/apiSlice";
import mapReducer from "../map/mapSlice";
import unitReducer from "../unit/state/reducer";
import searchReducer from "../unit/state/search/reducer";

const createRootReducer = () =>
  combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    unit: unitReducer,
    map: mapReducer,
    search: searchReducer,
  });

export default createRootReducer;
