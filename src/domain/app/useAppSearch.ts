import { useLocation } from "react-router";

import useSearch from "../../common/hooks/useSearch";
import { AppSearch, AppSearchLocationState } from "../app/appConstants";
import { SortKeys, UNIT_BATCH_SIZE } from "../unit/unitConstants";
import {
  getDefaultSportFilter,
  getDefaultStatusFilter,
} from "../unit/unitHelpers";

function useAppSearch() {
  // When an unit is opened, the selected search params get hidden into location
  // state so that the link is more clean if the user decides to share it. This
  // hook will try to find the search from the location state if it can't be
  // found from the search query string.
  const { state } = useLocation<AppSearchLocationState>();
  const {
    q,
    sport = state?.search?.sport || getDefaultSportFilter(),
    status = state?.search?.status || getDefaultStatusFilter(),
    sortKey = state?.search?.sortKey || SortKeys.DISTANCE,
    maxUnitCount = state?.search?.maxUnitCount || UNIT_BATCH_SIZE.toString(),
  } = useSearch<AppSearch>();

  return { q, sport, status, sortKey, maxUnitCount };
}

export default useAppSearch;
