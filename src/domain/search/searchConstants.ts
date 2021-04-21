import { SportFilter, StatusFilter, SortKey } from "../unit/unitConstants";
import { normalizeActionName } from "../utils";

export const SearchActions = {
  CLEAR: normalizeActionName("search/CLEAR"),
  FETCH_UNITS: normalizeActionName("search/FETCH_UNITS"),
  RECEIVE_UNITS: normalizeActionName("search/RECEIVE_UNITS"),
  FETCH_UNIT_SUGGESTIONS: normalizeActionName("search/FETCH_UNIT_SUGGESTIONS"),
  RECEIVE_UNIT_SUGGESTIONS: normalizeActionName(
    "search/RECEIVE_UNIT_SUGGESTIONS"
  ),
  RECEIVE_ADDRESS_SUGGESTIONS: normalizeActionName(
    "search/RECEIVE_ADDRESS_SUGGESTIONS"
  ),
};

export type SearchState = {
  isFetching: boolean;
  isActive: boolean;
  // Filtered arrays of unit ids
  unitSuggestions: Array<string>;
  unitResults: Array<string>;
  addressSuggestions: Array<Record<string, any>>; // TODO: Filtered arrays of streets / address search
};

export const MAX_SUGGESTION_COUNT = 5;

export type Search = {
  q?: string;
  sport?: SportFilter;
  status?: StatusFilter;
  sortKey?: SortKey;
  maxUnitCount?: string;
};

export type SearchLocationState = {
  search?: Search;
  previous?: string;
};
