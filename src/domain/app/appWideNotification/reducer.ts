import keys from "lodash/keys";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { EntityAction } from "../../../domain/app/appConstants";
import { AppWideNotificationActions } from "./appWideNotificationConstants";

const isFetchingReducer = handleActions(
  {
    [AppWideNotificationActions.FETCH]: () => true,
    [AppWideNotificationActions.RECEIVE]: () => false,
    [AppWideNotificationActions.FETCH_ERROR]: () => false,
  },
  false
);

const fetchErrorReducer = handleActions(
  {
    [AppWideNotificationActions.FETCH]: () => null,
    [AppWideNotificationActions.RECEIVE]: () => null,
    [AppWideNotificationActions.FETCH_ERROR]: (state: Record<string, any> | null, action) =>
      action?.payload?.error,
  },
  null
);

const byIdReducer = handleActions(
  {
    [AppWideNotificationActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => ({ ...entities.appWideNotification }),
  },
  {}
);

const all = handleActions(
  {
    [AppWideNotificationActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [...keys(entities.appWideNotification)],
  },
  []
);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  fetchError: fetchErrorReducer,
  byId: byIdReducer,
  all,
});

export default reducer;
