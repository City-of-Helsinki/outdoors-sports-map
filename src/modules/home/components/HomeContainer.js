import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { getUnitPosition } from '../../unit/helpers';
import UnitDetails from '../../unit/components/UnitDetailsContainer';
import UnitBrowserPage from '../../unit/components/UnitBrowserContainer';
import { routerPaths } from '../../common/constants';
import useIsMobile from '../../common/hooks/useIsMobile';
import Map from '../../map/components/Map';

function getLatLngToContainerPoint(ref, location) {
  const map = ref.current;

  if (!map) {
    return null;
  }

  return map.mapRef.leafletElement.latLngToContainerPoint(location);
}

function getContainerPointToLatLng(ref, location) {
  const map = ref.current;

  if (!map) {
    return null;
  }

  return map.mapRef.leafletElement.containerPointToLatLng(location);
}

function setView(ref, coordinates) {
  const map = ref.current;

  if (map) {
    map.setView(coordinates);
  }
}

function MapLayout({ content, map }) {
  return (
    <div>
      {content}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {map}
      </div>
    </div>
  );
}

MapLayout.propTypes = {
  content: PropTypes.node.isRequired,
  map: PropTypes.node.isRequired,
};

function HomeContainer() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const match = useRouteMatch(routerPaths.singleUnit);
  const isMobile = useIsMobile();

  const selectedUnitId = match ? match.params.unitId : null;
  const isUnitDetailsOpen = selectedUnitId !== null;

  const handleOnViewChange = useCallback((coordinates) => {
    setView(mapRef, coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit) => {
      const location = getUnitPosition(unit);
      const pixelLocation = getLatLngToContainerPoint(mapRef, location);

      if (!isMobile) {
        // Offset by half the width of unit modal in order to center focus
        // on the visible map
        pixelLocation.x -= 200;
        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        setView(mapRef, adjustedCenter);
      } else {
        // On mobile we want to move the map 250px down from the center, so the
        // big info box does not hide the selected unit.
        pixelLocation.y -= 250;
        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        setView(mapRef, adjustedCenter);
      }
    },
    [isMobile]
  );

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchUnits());
    dispatch(fetchServices());
  }, []);

  return (
    <MapLayout
      content={
        <>
          {/* Hide unit browser when the unit details is open with styling. */}
          {/* This is an easy way to retain the search state. */}
          <div style={{ display: isUnitDetailsOpen ? 'none' : undefined }}>
            <UnitBrowserPage
              mapRef={mapRef}
              onViewChange={handleOnViewChange}
            />
          </div>
          {isUnitDetailsOpen && (
            <UnitDetails
              unitId={selectedUnitId}
              onCenterMapToUnit={handleCenterMapToUnit}
            />
          )}
        </>
      }
      map={
        <Map
          ref={mapRef}
          selectedUnitId={selectedUnitId}
          onCenterMapToUnit={handleCenterMapToUnit}
        />
      }
    />
  );
}

export default HomeContainer;
