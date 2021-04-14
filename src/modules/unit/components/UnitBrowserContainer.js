// @flow

import React from 'react';
import { useSelector } from 'react-redux';
// $FlowFixMe: Type definitions are out of date
import { useLocation, useParams } from 'react-router-dom';

import * as fromMap from '../../map/selectors';
import * as fromSearch from '../../search/selectors';
import * as fromService from '../../service/selectors';
import getIsLoading from '../../home/selectors';
import { arrayifyQueryValue } from '../../common/helpers';
import { getDefaultFilters } from '../helpers';
import * as fromUnit from '../selectors';
import UnitBrowser from './UnitBrowser';

function getLeafletMap(ref) {
  const map = ref.current;

  if (!map) {
    return null;
  }

  return map.mapRef.leafletElement;
}

type Props = {
  mapRef: Object,
  onViewChange: (coordinates: [number, number]) => void,
  expandedState: [boolean, (value: boolean) => void],
};

const UnitBrowserContainer = ({
  mapRef,
  onViewChange,
  expandedState,
}: Props) => {
  const { search } = useLocation();
  const params = useParams();
  const location = useLocation();

  const unitData = useSelector((state) =>
    fromUnit.getVisibleUnits(state, location.search)
  );
  const serviceData = useSelector(fromService.getServicesObject);
  const isLoading = useSelector(getIsLoading);
  const isSearching = useSelector(fromSearch.getIsFetching);
  const mapCenter = useSelector(fromMap.getLocation);
  const address = useSelector(fromMap.getAddress);

  const filter = new URLSearchParams(search).get('filter');
  const activeFilter = filter
    ? arrayifyQueryValue(filter)
    : getDefaultFilters();

  return (
    <UnitBrowser
      isLoading={isLoading}
      isSearching={isSearching}
      units={unitData}
      services={serviceData}
      activeFilter={activeFilter}
      position={mapCenter}
      address={address}
      params={params}
      leafletMap={getLeafletMap(mapRef)}
      singleUnitSelected={!!params.unitId}
      onViewChange={onViewChange}
      expandedState={expandedState}
    />
  );
};

export default UnitBrowserContainer;
