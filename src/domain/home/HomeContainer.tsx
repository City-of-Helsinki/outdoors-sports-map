import className from "classnames";
import { useCallback, useRef, ReactNode } from "react";
import { Map as RLMap } from "react-leaflet";
import { Switch, useRouteMatch, Route } from "react-router-dom";

import useIsMobile from "../../common/hooks/useIsMobile";
import ApplicationHeader from "../app/AppHeader";
import AppInfoDropdown from "../app/AppInfoDropdown";
import routerPaths from "../app/appRoutes";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import Map from "../map/Map";
import UnitBrowser from "../unit/browser/UnitBrowser";
import UnitDetails from "../unit/details/UnitDetails";
import { getUnitPosition } from "../unit/unitHelpers";
import useFetchInitialData from "./useFetchInitialData";

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
};

function MapLayout({ content, map }: MapLayoutProps) {
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
        <ApplicationHeader />
        <div className="map-foreground-content">{content}</div>
      </div>
      <AppInfoDropdown />
      <div className="map-container">{map}</div>
    </>
  );
}

function HomeContainer() {
  const mapRef = useRef<RLMap | null>(null);
  const leafletElementRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();

  const handleOnViewChange = useCallback((coordinates) => {
    leafletElementRef.current?.setView(coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit) => {
      const leafletElement = leafletElementRef.current;
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
    <MapLayout
      content={
        <Switch>
          <Route
            exact
            path={routerPaths.unitDetails}
            render={({
              match: {
                params: { unitId },
              },
            }) => (
              <UnitDetails
                // @ts-ignore
                unitId={unitId}
                onCenterMapToUnit={handleCenterMapToUnit}
              />
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
        <Map
          mapRef={(ref) => {
            mapRef.current = ref;
            leafletElementRef.current = ref?.leafletElement || null;
          }}
          leafletElementRef={leafletElementRef}
          onCenterMapToUnit={handleCenterMapToUnit}
        />
      }
    />
  );
}

export default HomeContainer;
