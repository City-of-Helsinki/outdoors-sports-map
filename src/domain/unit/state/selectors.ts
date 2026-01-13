import { createSelector } from "@reduxjs/toolkit";
import { union } from "lodash";
import intersection from "lodash/intersection";
import isEmpty from "lodash/isEmpty";

import {
  selectUnitResultIDs,
  selectIsActive,
} from "./search/selectors";
import { AppState } from "../../app/appConstants";
import {
  HikingFilter,
  HikingFilters,
  SkiingFilter,
  SkiingFilters,
  SportFilter,
  Unit,
  UnitFilters,
  UnitFilterValues,
} from "../unitConstants";
import {
  getFilteredUnitsBySportSpecification,
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getNoneHikingUnit,
} from "../unitHelpers";

export const selectUnitById = (state: AppState, props: Record<string, any>) =>
  state.unit.byId[props.id];

export const selectAllUnits = (state: AppState) =>
  state.unit.all.map((id) =>
    selectUnitById(state, {
      id,
    }),
  );

export const selectVisibleUnits = createSelector(
  [
    (state: AppState) => state.unit,
    (state: AppState, sport: SportFilter = getDefaultSportFilter()) => sport,
    (
      state: AppState,
      sport: SportFilter = getDefaultSportFilter(),
      status: UnitFilterValues = getDefaultStatusFilter(),
    ) => status,
    (
      state: AppState,
      sport: SportFilter = getDefaultSportFilter(),
      status: UnitFilterValues = getDefaultStatusFilter(),
      sportSpecification: string,
    ) => sportSpecification,
    (state: AppState) => selectIsActive(state),
    (state: AppState) => selectUnitResultIDs(state),
  ],
  (unitState, sport, status, sportSpecification, isSearchActive, unitResultIDs): Unit[] => {
    const hasHikingSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => HikingFilters.includes(elm as HikingFilter));
    const hasSkiSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => SkiingFilters.includes(elm as SkiingFilter));

    let visibleUnits;
    if (hasHikingSportSpecification) {
      const selectedUnit = unitState[sport],
        hikeUnit = unitState[UnitFilters.HIKING],
        combinedUnit = selectedUnit.concat(hikeUnit);
      visibleUnits = combinedUnit;
    } else {
      visibleUnits = unitState[sport];
    }

    if (status === UnitFilters.STATUS_OK) {
      visibleUnits = intersection(
        visibleUnits,
        unitState[UnitFilters.STATUS_OK],
      );
    }

    if (!!sportSpecification) {
      if (hasHikingSportSpecification) {
        visibleUnits = union(
          hasSkiSportSpecification
            ? getFilteredUnitsBySportSpecification(
                getNoneHikingUnit(visibleUnits, unitState),
                unitState,
                sportSpecification,
              )
            : getNoneHikingUnit(visibleUnits, unitState),
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitState,
            sportSpecification,
          ),
        );
      } else {
        visibleUnits = intersection(
          visibleUnits,
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitState,
            sportSpecification,
          ),
        );
      }
    }

    if (isSearchActive) {
      visibleUnits = intersection(visibleUnits, unitResultIDs);
    }

    return visibleUnits.map((id: string) => unitState.byId[id]);
  },
);

export const selectIsUnitLoading = (state: AppState) =>
  state.unit.isFetching && isEmpty(state.unit.all);
