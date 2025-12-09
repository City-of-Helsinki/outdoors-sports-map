import className from "classnames";
import { IconAngleLeft, IconAngleRight } from "hds-react";
import { Map } from "leaflet";
import { useCallback, useRef, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useRouteMatch, Route } from "react-router-dom";

import useFetchInitialData from "./useFetchInitialData";
import TextRevealButton from "../../common/components/TextRevealButton";
import useIsMobile from "../../common/hooks/useIsMobile";
import ApplicationHeader from "../app/AppHeader";
import CookieConsent from "../app/CookieConsent";
import routerPaths from "../app/appRoutes";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import MapComponent from "../map/MapComponent";
import { DETAIL_ZOOM_IN } from "../map/mapConstants";
import UnitBrowser from "../unit/browser/UnitBrowser";
import UnitDetails from "../unit/details/UnitDetails";
import { Unit } from "../unit/unitConstants";
import { getUnitPosition } from "../unit/unitHelpers";

const PANEL_ID = "map-foreground-panel";

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

function MapLayout({
  content,
  map,
  isExpanded,
  toggleIsExpanded,
}: Readonly<MapLayoutProps>) {
  const { t } = useTranslation();
  const isUnitSearchOpen = useIsUnitBrowserSearchView();
  const isUnitDetailsOpen = useIsUnitDetailsSearchView();

  const isFilled = isUnitDetailsOpen || isUnitSearchOpen;

  const isMobile = useIsMobile();

  const [headerHeight, setHeaderHeight] = useState<number>(0);

  return (
    <>
      <ApplicationHeader
        isExpanded={isExpanded}
        onHeaderHeightChange={setHeaderHeight}
        panelId={PANEL_ID}
        toggleIsExpanded={toggleIsExpanded}
      />
      <div
        className={className("map-foreground", {
          "full-height": isUnitDetailsOpen || isUnitSearchOpen,
          "panel-expanded": isExpanded,
        })}
      >
        <aside
          id={PANEL_ID}
          className={className("map-foreground__panel", {
            "is-filled": isFilled,
            "fill-color-content": !isUnitSearchOpen,
            "fill-color-background": isUnitSearchOpen,
          })}
          aria-label={
            isUnitDetailsOpen
              ? t("APP.UNIT_DETAILS_PANEL")
              : t("APP.SEARCH_RESULTS_PANEL")
          }
          aria-hidden={!isExpanded}
          hidden={!isExpanded}
          style={
            {
              "--map-foreground-header-height": `${headerHeight}px`,
            } as React.CSSProperties
          }
        >
          <div
            className={
              isExpanded
                ? "map-foreground__panel-content"
                : "map-foreground__panel-content hidden"
            }
          >
            {content}
          </div>
        </aside>
        {!isMobile && (
          <TextRevealButton
            aria-controls={PANEL_ID}
            aria-expanded={isExpanded}
            className={className("map-collapse-button", {
              "panel-hidden": !isExpanded,
            })}
            icon={isExpanded ? <IconAngleLeft /> : <IconAngleRight />}
            iconPosition={isExpanded ? "start" : "end"}
            showTextAlways={!isExpanded}
            text={isExpanded ? t("APP.HIDE_SIDEBAR") : t("APP.SHOW_SIDEBAR")}
            onClick={toggleIsExpanded}
          />
        )}
      </div>
      {/* Render map only when screenHeight and headerHeight are known to center the map correctly */}
      {headerHeight > 0 && (
        <div
          className="map-container"
          style={
            {
              "--map-container-header-height": `${headerHeight}px`,
            } as React.CSSProperties
          }
        >
          {map}
        </div>
      )}
    </>
  );
}

function HomeContainer() {
  const leafletElementRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();
  const [isUnitDetailsExpanded, setIsUnitDetailsExpanded] = useState(false);

  const toggleIsUnitDetailsExpanded = () => {
    setIsUnitDetailsExpanded(!isUnitDetailsExpanded);
  };

  const [isHomeContainerExpanded, setIsHomeContainerExpanded] = useState(true);

  const toggleIsHomeContainerExpanded = () => {
    setIsHomeContainerExpanded(!isHomeContainerExpanded);
  };

  const handleOnViewChange = useCallback((coordinates: [number, number]) => {
    leafletElementRef.current?.setView(coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit: Unit, map: Map | null) => {
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

        const adjustedCenter =
          leafletElement?.containerPointToLatLng(pixelLocation);

        if (adjustedCenter) {
          leafletElement?.setView(adjustedCenter);
          if (unit.geometry.type === "MultiLineString") {
            // if the geometry is a MultiLineString, then zoom in to the bounds of the geometry
            // get a flat array of coordinates
            const coordinates = unit.geometry.coordinates.flat();
            // get the maximum latitude and longitude
            const maxLon = Math.max(
                ...coordinates.map((coord: number[]) => coord[0]),
              ),
              minLon = Math.min(
                ...coordinates.map((coord: number[]) => coord[0]),
              ),
              maxLat = Math.max(
                ...coordinates.map((coord: number[]) => coord[1]),
              ),
              minLat = Math.min(
                ...coordinates.map((coord: number[]) => coord[1]),
              );
            // zoom to the bounds of the geometry
            leafletElement?.fitBounds([
              [minLat, minLon],
              [maxLat, maxLon],
            ]);
          } else {
            // if the geometry is a point, then zoom in to that point
            const coordinates = unit.location.coordinates;
            leafletElement?.flyTo(
              [coordinates[1], coordinates[0]],
              DETAIL_ZOOM_IN,
            );
          }
        }
      } else {
        // On mobile we want to move the map 250px down from the center, so the
        // big info box does not hide the selected unit.
        pixelLocation.y -= 250;

        const adjustedCenter =
          leafletElement?.containerPointToLatLng(pixelLocation);

        if (adjustedCenter) {
          leafletElement?.setView(adjustedCenter);
        }
      }
    },
    [isMobile],
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
                <UnitDetails
                  onCenterMapToUnit={handleCenterMapToUnit}
                  isExpanded={isUnitDetailsExpanded}
                  toggleIsExpanded={toggleIsUnitDetailsExpanded}
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
