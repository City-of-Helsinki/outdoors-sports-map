import isEmpty from "lodash/isEmpty";

import type { AppState } from "./appConstants";
import { selectIsFetchingService, selectServicesState } from "../service/serviceSlice";

export const getIsLoading = (state: AppState): boolean =>
  (state.unit.isFetching && isEmpty(state.unit.all)) ||
  (selectIsFetchingService(state) && isEmpty(selectServicesState(state).all));