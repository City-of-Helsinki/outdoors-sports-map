// @flow
// eslint-disable-next-line import/no-cycle
import { normalizeActionName } from '../common/helpers';

export const SearchActions = {
  CLEAR: normalizeActionName('search/CLEAR'),
  FETCH_UNITS: normalizeActionName('search/FETCH_UNITS'),
  RECEIVE_UNITS: normalizeActionName('search/RECEIVE_UNITS'),
  FETCH_UNIT_SUGGESTIONS: normalizeActionName('search/FETCH_UNIT_SUGGESTIONS'),
  RECEIVE_UNIT_SUGGESTIONS: normalizeActionName(
    'search/RECEIVE_UNIT_SUGGESTIONS'
  ),
  RECEIVE_ADDRESS_SUGGESTIONS: normalizeActionName(
    'search/RECEIVE_ADDRESS_SUGGESTIONS'
  ),
};

export type SearchState = {
  isFetching: boolean,
  isActive: boolean,
  // Filtered arrays of unit ids
  unitSuggestions: Array<string>,
  unitResults: Array<string>,
  addressSuggestions: Array<Object>,
  // TODO: Filtered arrays of streets / address search
};

export const MAX_SUGGESTION_COUNT = 5;
