import keys from "lodash/keys";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { ServiceActions } from "./serviceConstants";
import { EntityAction } from "../../domain/app/appConstants";

const isFetchingReducer = handleActions(
  {
    [ServiceActions.FETCH]: () => true,
    [ServiceActions.RECEIVE]: () => false,
    [ServiceActions.FETCH_ERROR]: () => false,
  },
  false,
);

const fetchErrorReducer = handleActions(
  {
    [ServiceActions.FETCH]: () => null,
    [ServiceActions.RECEIVE]: () => null,
    [ServiceActions.FETCH_ERROR]: (state: Record<string, any> | null, action) =>
      action?.payload?.error,
  },
  null,
);

const byIdReducer = handleActions(
  {
    [ServiceActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => ({ ...entities.service }),
  },
  {},
);

const all = handleActions(
  {
    [ServiceActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [...keys(entities.service)],
  },
  [],
);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  fetchError: fetchErrorReducer,
  byId: byIdReducer,
  all,
});

export default reducer;
