import intersection from "lodash/intersection";
import isEmpty from "lodash/isEmpty";
import memoize from "lodash/memoize";

import { AppState } from "../../app/appConstants";
import {
  SportFilter,
  Unit,
  UnitFilters,
  UnitFilterValues,
} from "../unitConstants";
import {
  getFilteredUnitsBySportSpecification,
  getDefaultSportFilter,
  getDefaultStatusFilter,
} from "../unitHelpers";
import {
  getIsActive as getSearchActive,
  getUnitResultIDs,
} from "./search/selectors";

export const getUnitById = (state: AppState, props: Record<string, any>) =>
  state.unit.byId[props.id];

export const getAllUnits = (state: AppState) =>
  state.unit.all.map((id) =>
    getUnitById(state, {
      id,
    })
  );

const _getVisibleUnits = (
  state: AppState,
  sport: SportFilter = getDefaultSportFilter(),
  status: UnitFilterValues = getDefaultStatusFilter(),
  sportSpecification: string
): Unit[] => {
  let visibleUnits = state.unit[sport];

  if (status === UnitFilters.STATUS_OK) {
    visibleUnits = intersection(
      visibleUnits,
      state.unit[UnitFilters.STATUS_OK]
    );
  }

  if (!!sportSpecification) {
    visibleUnits = intersection(
      visibleUnits,
      getFilteredUnitsBySportSpecification(
        visibleUnits,
        state.unit,
        sportSpecification
      )
    );
  }

  if (getSearchActive(state)) {
    visibleUnits = intersection(visibleUnits, getUnitResultIDs(state));
  }

  return visibleUnits.map((id: string) =>
    getUnitById(state, {
      id,
    })
  );
};

export const getVisibleUnits = memoize(
  _getVisibleUnits,
  (state, sport, status, sportSpecification) =>
    `${JSON.stringify(state.unit)}${String(
      getSearchActive(state)
    )}${JSON.stringify(
      getUnitResultIDs(state)
    )}${sport},${status},${sportSpecification}`
);

export const getIsFetchingUnits = (state: AppState) => state.unit.isFetching;

export const getIsLoading = (state: AppState) =>
  state.unit.isFetching && isEmpty(state.unit.all);
