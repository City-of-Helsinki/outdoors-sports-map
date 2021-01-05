// @flow
import keys from 'lodash/keys';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { ServiceActions } from './constants';
import type { EntityAction } from '../common/constants';

const isFetchingReducer = handleActions(
  {
    [ServiceActions.FETCH]: () => true,
    [ServiceActions.RECEIVE]: () => false,
    [ServiceActions.FETCH_ERROR]: () => false,
  },
  false
);

const fetchErrorReducer = handleActions(
  {
    [ServiceActions.FETCH]: () => null,
    [ServiceActions.RECEIVE]: () => null,
    [ServiceActions.FETCH_ERROR]: (state: Object, { payload: { error } }) =>
      error,
  },
  null
);

const byIdReducer = handleActions(
  {
    [ServiceActions.RECEIVE]: (
      state: Object,
      { payload: { entities } }: EntityAction
    ) => ({ ...entities.service }),
  },
  {}
);

const all = handleActions(
  {
    [ServiceActions.RECEIVE]: (
      state: Object,
      { payload: { entities } }: EntityAction
    ) => [...keys(entities.service)],
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
