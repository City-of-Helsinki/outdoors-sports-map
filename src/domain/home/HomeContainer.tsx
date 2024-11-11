import className from "classnames";
import { useCallback, useRef, ReactNode, useState } from "react";
import { Switch, useRouteMatch, Route } from "react-router-dom";

import useFetchInitialData from "./useFetchInitialData";
import useIsMobile from "../../common/hooks/useIsMobile";
import ApplicationHeader from "../app/AppHeader";
import AppInfoDropdown from "../app/AppInfoDropdown";
import CookieConsent from "../app/CookieConsent";
import routerPaths from "../app/appRoutes";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import MapComponent from "../map/MapComponent";
import { DETAIL_ZOOM_IN } from "../map/mapConstants";
import UnitBrowser from "../unit/browser/UnitBrowser";
import UnitDetails from "../unit/details/UnitDetails";
import { getUnitPosition } from "../unit/unitHelpers";

function useIsUnitDetailsSearchView() {
  const match = useRouteMatch({
    path: routerPaths.unitDetails,
    exact: true,
  });

  return Boolean(match && match.isExact);
}

type MapLayoutProps = {
  content: ReactNode;
  map: ReactNode;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
};

function MapLayout({ content, map, isExpanded, toggleIsExpanded }: MapLayoutProps) {
  const isUnitSearchOpen = useIsUnitBrowserSearchView();
  const isUnitDetailsOpen = useIsUnitDetailsSearchView();

  const isFilled = isUnitDetailsOpen || isUnitSearchOpen;

  return (
    <>
      <div
        className={className("map-foreground", {
          "is-filled": isFilled,
          "fill-color-content": !isUnitSearchOpen,
          "fill-color-background": isUnitSearchOpen,
        })}
      >
        <ApplicationHeader toggleExpand={toggleIsExpanded} isExpanded={isExpanded} />
        <div className={ isExpanded ? "map-foreground-content" : "map-foreground-content hidden"}>{content}</div>
      </div>
      <AppInfoDropdown />
      <div className="map-container">{map}</div>
    </>
  );
}

function HomeContainer() {
  const leafletElementRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();
  const [isUnitDetailsExpanded, setIsUnitDetailsExpanded] = useState(false);

  const toggleIsUnitDetailsExpanded = () => {
    setIsUnitDetailsExpanded(!isUnitDetailsExpanded)
  }

  const [isHomeContainerExpanded, setIsHomeContainerExpanded] = useState(true);

  const toggleIsHomeContainerExpanded = () => {
    setIsHomeContainerExpanded(!isHomeContainerExpanded)
  }

  const handleOnViewChange = useCallback((coordinates) => {
    leafletElementRef.current?.setView(coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit, map) => {
      const leafletElement = leafletElementRef.current || map;
      const location = getUnitPosition(unit);

      if (!location) {
        return;
      }

      const pixelLocation = leafletElement?.latLngToContainerPoint(location);

      if (!pixelLocation) {
        return;
      }

      if (!isMobile) {
        // Offset by half the width of unit modal in order to center focus
        // on the visible map
        pixelLocation.x -= 200;

        const adjustedCenter = leafletElement?.containerPointToLatLng(
          pixelLocation
        );

        if (adjustedCenter) {
          leafletElement?.setView(adjustedCenter);
          if (unit.geometry.type === 'MultiLineString') {
            // if the geometry is a MultiLineString, then zoom in to the bounds of the geometry
            // get a flat array of coordinates
            const coordinates = unit.geometry.coordinates.flat();
            // get the maximum latitude and longitude
            const maxLon = Math.max(...coordinates.map((coord:number[]) => coord[0])),
            minLon = Math.min(...coordinates.map((coord:number[]) => coord[0])),
            maxLat = Math.max(...coordinates.map((coord:number[]) => coord[1])),
            minLat = Math.min(...coordinates.map((coord:number[]) => coord[1]));
            // zoom to the bounds of the geometry
            leafletElement?.fitBounds([[minLat, minLon], [maxLat, maxLon]]);
          } else {
            // if the geometry is a point, then zoom in to that point
            const coordinates = unit.location.coordinates;
            leafletElement?.flyTo([coordinates[1], coordinates[0]], DETAIL_ZOOM_IN);
          }
        }
      } else {
        // On mobile we want to move the map 250px down from the center, so the
        // big info box does not hide the selected unit.
        pixelLocation.y -= 250;

        const adjustedCenter = leafletElement?.containerPointToLatLng(
          pixelLocation
        );

        if (adjustedCenter) {
          leafletElement?.setView(adjustedCenter);
        }
      }
    },
    [isMobile]
  );

  useFetchInitialData();

  return (
    <>
      <MapLayout
        content={
          <Switch>
            <Route
              exact
              path={routerPaths.unitDetails}
              render={() => (
                <UnitDetails onCenterMapToUnit={handleCenterMapToUnit} isExpanded={isUnitDetailsExpanded} toggleIsExpanded={toggleIsUnitDetailsExpanded} />
              )}
            />
            <Route
              path={routerPaths.unitBrowser}
              render={() => (
                <UnitBrowser
                  leafletMap={leafletElementRef}
                  onViewChange={handleOnViewChange}
                />
              )}
            />
          </Switch>
        }
        map={
          <MapComponent
            leafletElementRef={leafletElementRef}
            onCenterMapToUnit={handleCenterMapToUnit}
          />
        }
        isExpanded={isHomeContainerExpanded}
        toggleIsExpanded={toggleIsHomeContainerExpanded}
      />
      <CookieConsent />
    </>
  );
}

export default HomeContainer;
