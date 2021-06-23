import isEmpty from "lodash/isEmpty";

import type { AppState } from "./appConstants";

export const getIsLoading = (state: AppState): boolean =>
  (state.unit.isFetching && isEmpty(state.unit.all)) ||
  (state.service.isFetching && isEmpty(state.service.all));
