import L, { LatLngTuple } from "leaflet";
import { RefObject } from "react";
import { useSelector } from "react-redux";

import { AppState } from "../../../app/appConstants";
import * as fromHome from "../../../app/appSelectors";
import useAppSearch from "../../../app/useAppSearch";
import * as fromMap from "../../../map/state/selectors";
import * as fromUnitSearch from "../../state/search/selectors";
import * as fromUnit from "../../state/selectors";
import { SortKeys, Unit } from "../../unitConstants";
import * as unitHelpers from "../../unitHelpers";

type SortOptions = {
  units: Unit[];
  position: LatLngTuple;
  leafletMap?: L.Map | null;
  sortKey: string;
};

function sortUnits({ units, position, leafletMap, sortKey }: SortOptions) {
  let sortedUnits: Unit[] = [];

  switch (sortKey) {
    case SortKeys.ALPHABETICAL:
      sortedUnits = unitHelpers.sortByName(units, "fi");
      break;

    case SortKeys.CONDITION:
      sortedUnits = unitHelpers.sortByCondition(units);
      break;

    case SortKeys.DISTANCE:
      // @ts-ignore
      sortedUnits = unitHelpers.sortByDistance(units, position, leafletMap);
      break;

    case SortKeys.FAVORITES:
      sortedUnits = unitHelpers.sortByFavorites(units);
      break;

    default:
      sortedUnits = units;
  }

  return sortedUnits;
}

type Options = {
  leafletMap?: RefObject<L.Map | null>;
  sortKey: string;
  maxUnitCount: number;
};

function useUnitSearchResults({ leafletMap }: Options) {
  const { sport, status, sortKey, maxUnitCount, sportSpecification } =
    useAppSearch();

  const units = useSelector<AppState, Unit[]>((state) =>
    fromUnit.getVisibleUnits(state, sport, status, sportSpecification),
  );
  const isLoading = useSelector<AppState, boolean>(fromHome.getIsLoading);
  const isSearching = useSelector<AppState, boolean>(
    fromUnitSearch.getIsFetching,
  );
  const position = useSelector<AppState, LatLngTuple>(fromMap.getLocation);

  if (isLoading || isSearching) {
    return { totalUnits: units.length, results: null };
  }

  const results = sortUnits({
    sortKey,
    units,
    leafletMap: leafletMap?.current,
    position,
  }).slice(0, Number(maxUnitCount));

  return { totalUnits: units.length, results };
}

export default useUnitSearchResults;
