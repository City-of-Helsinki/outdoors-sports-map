// @flow
import { createAction } from 'redux-actions';
import values from 'lodash/values';
import { UnitActions } from './constants';
import type { Action } from '../common/constants';
import type { ApiResponse } from '../api/constants';
import { UnitServices } from '../service/constants';

export const fetchUnits = (params: Object): Action => createAction(UnitActions.FETCH)({ params });

export const receiveUnits = (data: ApiResponse): Action => createAction(UnitActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) => createAction(UnitActions.FETCH_ERROR)({ error });

export const clearSearch = () => createAction(UnitActions.SEARCH_CLEAR)();

export const searchUnits = (input: string, params: Object): Action => {
  const init = {
    input,
    service: `${values(UnitServices).join(',')}`,
  };

  params = { ...init, ...params };
  return createAction(UnitActions.SEARCH_REQUEST)({ params });
};

export const fetchSearchSuggestions = (input: string): Action => createAction(UnitActions.FETCH_SEARCH_SUGGESTIONS)({
  params: {
    input,
    service: `${values(UnitServices).join(',')}`,
    page_size: 5,
  },
});

export const receiveSearchResults = (results: Array<Object>) => createAction(UnitActions.SEARCH_RECEIVE)(results);

export const receiveSearchSuggestions = (results: Array<Object>) => createAction(UnitActions.RECEIVE_SEARCH_SUGGESTIONS)(results);

export const sendFeedback = (feedback: string) => createAction(UnitActions.SEND_FEEDBACK)({ feedback });
