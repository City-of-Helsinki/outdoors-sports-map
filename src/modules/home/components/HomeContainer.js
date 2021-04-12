import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import UnitDetails from '../../unit/components/UnitDetailsContainer';
import UnitBrowserPage from '../../unit/components/UnitBrowserContainer';
import { routerPaths } from '../../common/constants';
import Map from '../../map/components/Map';

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

  const selectedUnitId = match ? match.params.unitId : null;
  const isUnitDetailsOpen = selectedUnitId !== null;

  const handleOnViewChange = useCallback((coordinates) => {
    setView(mapRef, coordinates);
  }, []);

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
              onViewChange={handleOnViewChange}
            />
          )}
        </>
      }
      map={<Map ref={mapRef} selectedUnitId={selectedUnitId} />}
    />
  );
}

export default HomeContainer;
