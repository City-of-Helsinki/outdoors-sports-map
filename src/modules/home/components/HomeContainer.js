// @flow

// $FlowIgnore
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Node } from 'react';
// $FlowIgnore
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import className from 'classnames';

import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { getUnitPosition, getAttr } from '../../unit/helpers';
import { getUnitById } from '../../unit/selectors';
import UnitDetails from '../../unit/components/UnitDetailsContainer';
import UnitBrowserContainer from '../../unit/components/UnitBrowserContainer';
import routerPaths from '../../common/routes';
import { languageParam } from '../../language/constants';
import ApplicationHeader from '../../common/components/ApplicationHeader';
import useIsMobile from '../../common/hooks/useIsMobile';
import Page from '../../common/components/Page';
import Map from '../../map/components/Map';

function useIsUnitBrowserView() {
  const match = useRouteMatch({
    path: ['/', `/${languageParam}`],
    exact: true,
  });

  return Boolean(match && match.isExact);
}

function useHomeMeta(selectedUnitId) {
  const {
    t,
    i18n: {
      languages: [activeLanguage],
    },
  } = useTranslation();
  const selectedUnit = useSelector((state) =>
    getUnitById(state, { id: selectedUnitId })
  );

  const getTitle = () => {
    const title = [];

    if (selectedUnit) {
      title.push(`${getAttr(selectedUnit.name, activeLanguage) || ''} | `);
    }

    title.push(t('APP.NAME'));

    return title.join('');
  };

  const getDescription = () => {
    if (selectedUnit) {
      const description = selectedUnit.description;

      if (description) {
        return getAttr(description, activeLanguage);
      }
    }

    return t('APP.DESCRIPTION');
  };

  const getImage = () => {
    if (selectedUnit) {
      return selectedUnit.picture_url;
    }
  };

  return {
    title: getTitle(),
    description: getDescription(),
    image: getImage(),
  };
}

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

type MapLayoutProps = {
  content: Node,
  map: Node,
  isFilled: boolean,
  title: string,
  description: ?string,
  image?: ?string,
};

function MapLayout({
  content,
  map,
  isFilled,
  title,
  description,
  image,
}: MapLayoutProps) {
  const isUnitBrowserView = useIsUnitBrowserView();

  return (
    <>
      <div
        className={className('map-foreground', {
          'is-filled': isFilled,
          'fill-color-content': !isUnitBrowserView,
          'fill-color-background': isUnitBrowserView,
        })}
      >
        <ApplicationHeader />
        <Page
          title={title}
          description={description}
          image={image}
          className="map-foreground-content"
        >
          {content}
        </Page>
      </div>
      <div className="map-container">{map}</div>
    </>
  );
}

function HomeContainer() {
  const mapRef = useRef(null);
  const [isExpanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const match = useRouteMatch(routerPaths.singleUnit);
  const isMobile = useIsMobile();

  const selectedUnitId = match ? match.params.unitId : null;
  const isUnitDetailsOpen = selectedUnitId !== null;

  const { title, description, image } = useHomeMeta(selectedUnitId);

  const handleOnViewChange = useCallback((coordinates) => {
    setView(mapRef, coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit) => {
      const location = getUnitPosition(unit);
      const pixelLocation = getLatLngToContainerPoint(mapRef, location);

      if (!pixelLocation) {
        return;
      }

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
    dispatch(fetchUnits({}));
    dispatch(fetchServices({}));
  }, [dispatch]);

  return (
    <MapLayout
      title={title}
      description={description}
      image={image}
      isFilled={isUnitDetailsOpen || isExpanded}
      content={
        <>
          <div
            className={className('map-foreground-unit-browser', {
              // Hide unit browser when the unit details is open with styling.
              // This is an easy way to retain the search state.
              hidden: isUnitDetailsOpen,
            })}
          >
            <UnitBrowserContainer
              mapRef={mapRef}
              onViewChange={handleOnViewChange}
              expandedState={[isExpanded, setExpanded]}
            />
          </div>
          {isUnitDetailsOpen && typeof selectedUnitId === 'string' && (
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
