import L, { LatLngTuple } from "leaflet";
import { RefObject } from "react";
import { useSelector } from "react-redux";

import { selectIsLoading } from "../../../app/state/appSelectors";
import { AppState } from "../../../app/types";
import useAppSearch from "../../../app/useAppSearch";
import { selectLocation } from "../../../map/state/mapSlice";
import { selectIsFetching } from "../../state/searchSlice";
import { selectVisibleUnits } from "../../state/unitSlice";
import { Unit } from "../../types";
import { SortKeys } from "../../unitConstants";
import {
  sortByName,
  sortByCondition,
  sortByDistance,
  sortByFavorites,
} from "../../unitHelpers";

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
      sortedUnits = sortByName(units, "fi");
      break;

    case SortKeys.CONDITION:
      sortedUnits = sortByCondition(units);
      break;

    case SortKeys.DISTANCE:
      // @ts-expect-error - sortByDistance function expects specific parameters that may have type conflicts
      sortedUnits = sortByDistance(units, position, leafletMap);
      break;

    case SortKeys.FAVORITES:
      sortedUnits = sortByFavorites(units);
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
    selectVisibleUnits(state, sport, status, sportSpecification),
  );
  const isLoading = useSelector<AppState, boolean>(selectIsLoading);
  const isSearching = useSelector<AppState, boolean>(selectIsFetching);
  const position = useSelector<AppState, LatLngTuple>(selectLocation);

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
