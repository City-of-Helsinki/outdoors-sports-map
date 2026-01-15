import { createSelector } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";

import { selectIsFetchingService, selectServicesState } from "../../service/state/serviceSlice";
import type { AppState } from "../appConstants";

export const selectIsLoading = createSelector(
  [
    (state: AppState) => state.unit.isFetching,
    (state: AppState) => state.unit.all,
    selectIsFetchingService,
    (state: AppState) => selectServicesState(state).all,
  ],
  (unitIsFetching, unitAll, serviceIsFetching, servicesAll): boolean =>
    (unitIsFetching && isEmpty(unitAll)) ||
    (serviceIsFetching && isEmpty(servicesAll))
);