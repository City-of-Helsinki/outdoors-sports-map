import isEmpty from "lodash/isEmpty";

import type { AppState } from "../common/constants";

const getIsLoading = (state: AppState): boolean =>
  (state.unit.isFetching && isEmpty(state.unit.all)) ||
  (state.service.isFetching && isEmpty(state.service.all));

export default getIsLoading;
