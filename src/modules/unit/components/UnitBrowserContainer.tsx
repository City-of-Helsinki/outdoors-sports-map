import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Address, AppState } from "../../common/constants";
import useSearch from "../../common/hooks/useSearch";
import getIsLoading from "../../home/selectors";
import { MapRef } from "../../map/constants";
import * as fromMap from "../../map/selectors";
import * as fromSearch from "../../search/selectors";
import { SportFilter, StatusFilter, Unit } from "../constants";
import * as fromUnit from "../selectors";
import UnitBrowser from "./UnitBrowser";

function getLeafletMap(ref: MapRef) {
  return ref.current?.leafletElement;
}

type Props = {
  mapRef: MapRef;
  onViewChange: (coordinates: [number, number]) => void;
  expandedState: [boolean, (value: boolean) => void];
};

function UnitBrowserContainer({ mapRef, onViewChange, expandedState }: Props) {
  const params = useParams<{ unitId: string }>();
  const { sport, status } = useSearch<{
    sport?: SportFilter;
    status?: StatusFilter;
  }>();

  const unitData = useSelector<AppState, Unit[]>((state) =>
    fromUnit.getVisibleUnits(state, sport, status)
  );

  const isLoading = useSelector<AppState, boolean>(getIsLoading);
  const isSearching = useSelector<AppState, boolean>(fromSearch.getIsFetching);
  const mapCenter = useSelector<AppState, [number, number]>(
    fromMap.getLocation
  );
  const address = useSelector<AppState, Address | undefined | null>(
    fromMap.getAddress
  );

  return (
    <UnitBrowser
      isLoading={isLoading}
      isSearching={isSearching}
      units={unitData}
      position={mapCenter}
      address={address}
      params={params}
      leafletMap={getLeafletMap(mapRef)}
      singleUnitSelected={!!params.unitId}
      onViewChange={onViewChange}
      expandedState={expandedState}
    />
  );
}

export default UnitBrowserContainer;
