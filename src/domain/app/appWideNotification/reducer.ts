import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { AppWideNotificationActions } from "./appWideNotificationConstants";

const isFetchingReducer = handleActions(
  {
    [AppWideNotificationActions.FETCH]: () => true,
    [AppWideNotificationActions.RECEIVE]: () => false,
    [AppWideNotificationActions.FETCH_ERROR]: () => false,
  },
  false,
);

const fetchErrorReducer = handleActions(
  {
    [AppWideNotificationActions.FETCH]: () => null,
    [AppWideNotificationActions.RECEIVE]: () => null,
    [AppWideNotificationActions.FETCH_ERROR]: (
      state: Record<string, any> | null,
      action,
    ) => action?.payload?.error,
  },
  null,
);

const data = handleActions(
  {
    [AppWideNotificationActions.RECEIVE]: (
      state: Record<string, any>,
      { payload },
    ) => payload,
  },
  {},
);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  fetchError: fetchErrorReducer,
  data,
});

export default reducer;
