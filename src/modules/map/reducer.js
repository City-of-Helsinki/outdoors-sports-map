// @flow
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { mapActions } from './constants';
import type { Action } from '../common/constants';
import { locations } from '../home/constants';

const centerReducer = handleActions({
  [mapActions.SET_LOCATION]: (state: Array<number>, { payload: position }: Action) => position,
}, locations.HELSINKI);

const addressReducer = handleActions({
  [mapActions.RECEIVE_ADDRESS]: (state: Array<number>, { payload: address }: Action) => address,
}, {});

const reducer = combineReducers({
  location: centerReducer,
  address: addressReducer,
});

export default reducer;
