import { createSelector } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";

import { selectIsFetchingService, selectServicesState } from "../../service/state/serviceSlice";
import type { AppState } from "../types";

export const selectIsLoading = createSelector(
  [
    (state: AppState) => state.unit.isFetching,
    (state: AppState) => state.unit.all,
    (state: AppState) => state.unit.seasonalAll,
    selectIsFetchingService,
    (state: AppState) => selectServicesState(state).all,
  ],
  (unitIsFetching, unitAll, seasonalAll, serviceIsFetching, servicesAll): boolean => {
    // Not loading if we have any data available (specific or seasonal)
    const hasAnyUnitData = !isEmpty(unitAll) || !isEmpty(seasonalAll);
    const hasServiceData = !isEmpty(servicesAll);
    
    return (
      (unitIsFetching && !hasAnyUnitData) ||
      (serviceIsFetching && !hasServiceData)
    );
  }
);