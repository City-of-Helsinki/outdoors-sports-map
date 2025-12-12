import { useLocation } from "react-router";

import useSearch from "../../common/hooks/useSearch";
import { AppSearch, AppSearchLocationState } from "../app/appConstants";
import { SortKeys, Unit, UNIT_BATCH_SIZE } from "../unit/unitConstants";
import {
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getUnitSport,
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
    sportSpecification = state?.search?.sportSpecification || "",
    sortKey = state?.search?.sortKey,
    maxUnitCount = state?.search?.maxUnitCount || UNIT_BATCH_SIZE.toString(),
  } = useSearch<AppSearch>();

  const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
  const selectedSport = sport;
  const sportFavourites = favourites.filter(
    (favourite: Unit) => getUnitSport(favourite) === selectedSport,
  );

  // If there are favourites, sort by them by default, otherwise sort by condition
  const defaultSortKey =
    sportFavourites.length > 0 ? SortKeys.FAVORITES : SortKeys.CONDITION;

  // Use defaultSortKey if sortKey is not defined
  const finalSortKey = sortKey || defaultSortKey;

  return {
    q,
    sport,
    status,
    sportSpecification,
    sortKey: finalSortKey,
    maxUnitCount,
  };
}

export default useAppSearch;
