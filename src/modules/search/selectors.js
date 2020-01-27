// @flow
import type { AppState } from '../common/constants';
import { getUnitById } from '../unit/selectors';

export const getIsActive = (state: AppState): boolean => state.search.isActive;

export const getIsFetching = (state: AppState): boolean => state.search.isFetching;

export const getUnitResults = (state: AppState): Array<Object> => state.search.unitResults.map((id) => getUnitById(state, { id }));

export const getUnitSuggestions = (state: AppState): Array<Object> => state.search.unitSuggestions.map((id) => getUnitById(state, { id }));

export const getUnitResultIDs = (state: AppState): Array<string> => state.search.unitResults;

export const getAddresses = (state: AppState): Array<Object> => state.search.addressSuggestions;
