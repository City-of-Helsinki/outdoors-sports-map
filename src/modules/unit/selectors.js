// @flow
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import memoize from 'lodash/memoize';

import type { AppState } from '../common/constants';
import { UnitFilters } from './constants';
// eslint-disable-next-line import/no-cycle
import {
  getIsActive as getSearchActive,
  getUnitResultIDs,
} from '../search/selectors';
import { getDefaultStatusFilter, getDefaultSportFilter } from './helpers';

export const getUnitById = (state: AppState, props: Object) =>
  state.unit.byId[props.id];

export const getAllUnits = (state: AppState /* , props: Object */) =>
  state.unit.all.map((id) => getUnitById(state, { id }));

const _getVisibleUnits = (state: AppState, query: Object) => {
  const sport = (query && query.sport) || getDefaultSportFilter();
  const status = (query && query.status) || getDefaultStatusFilter();
  let visibleUnits = state.unit[sport];

  if (status === UnitFilters.STATUS_OK) {
    visibleUnits = intersection(
      visibleUnits,
      // $FlowFixMe
      state.unit[UnitFilters.STATUS_OK]
    );
  }

  if (getSearchActive(state)) {
    visibleUnits = intersection(visibleUnits, getUnitResultIDs(state));
  }

  return visibleUnits.map((id) => getUnitById(state, { id }));
};

export const getVisibleUnits = memoize(
  _getVisibleUnits,
  (state: AppState, query: Array<string>) =>
    `${JSON.stringify(state.unit)}${String(
      getSearchActive(state)
    )}${JSON.stringify(getUnitResultIDs(state))}${JSON.stringify(query)}`
);

export const getSearchResults = (state: AppState /* , props: Object */) =>
  state.unit.searchResults.map((id) => getUnitById(state, { id }));

export const getSearchSuggestions = (state: AppState): Array<Object> =>
  // $FlowFixMe
  state.unit.searchSuggestions.map((id) => getUnitById(state, { id }));

export const getIsFetchingUnits = (state: AppState) => state.unit.isFetching;

export const getIsLoading = (state: AppState) =>
  state.unit.isFetching && isEmpty(state.unit.all);
