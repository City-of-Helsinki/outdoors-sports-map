// @flow
import { createAction } from 'redux-actions';
import values from 'lodash/values';
import { SearchActions, MAX_SUGGESTION_COUNT } from './constants';
import type { Action } from '../common/constants';
import { UnitServices } from '../service/constants';

export const clearSearch = () => createAction(SearchActions.CLEAR)();

export const searchUnits = (input: string, params: Object): Action => {
  const init = {
    input,
    service: `${values(UnitServices).join(',')}`,
  };

  // eslint-disable-next-line no-param-reassign
  params = { ...init, ...params };
  return createAction(SearchActions.FETCH_UNITS)({ params });
};

export const receiveUnits = (results: Array<Object>) =>
  createAction(SearchActions.RECEIVE_UNITS)(results);

export const fetchUnitSuggestions = (input: string): Action =>
  createAction(SearchActions.FETCH_UNIT_SUGGESTIONS)({
    params: {
      input,
      service: `${values(UnitServices).join(',')}`,
      page_size: MAX_SUGGESTION_COUNT,
    },
  });

export const receiveUnitSuggestions = (results: Array<Object>) =>
  createAction(SearchActions.RECEIVE_UNIT_SUGGESTIONS)(results);

export const receiveAddressSuggestions = (results: Array<Object>) =>
  createAction(SearchActions.RECEIVE_ADDRESS_SUGGESTIONS)(results);
