import { createSelector } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";

import type { AppState } from "./appConstants";
import { selectIsFetchingService, selectServicesState } from "../service/serviceSlice";

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