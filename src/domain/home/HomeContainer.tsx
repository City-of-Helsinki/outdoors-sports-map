import className from "classnames";
import { useCallback, useRef, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Map as RLMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { Switch, useRouteMatch, Route } from "react-router-dom";

import Page from "../../common/a11y/Page";
import useIsMobile from "../../common/hooks/useIsMobile";
import useLanguage from "../../common/hooks/useLanguage";
import ApplicationHeader from "../app/AppHeader";
import AppInfoDropdown from "../app/AppInfoDropdown";
import { AppState } from "../app/appConstants";
import routerPaths from "../app/appRoutes";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import Map from "../map/Map";
import UnitBrowser from "../unit/browser/UnitBrowser";
import UnitDetails from "../unit/details/UnitDetails";
import { getUnitById } from "../unit/state/selectors";
import { Unit } from "../unit/unitConstants";
import { getAttr, getUnitPosition } from "../unit/unitHelpers";
import useFetchInitialData from "./useFetchInitialData";

function useIsUnitDetailsSearchView() {
  const match = useRouteMatch({
    path: routerPaths.unitDetails,
    exact: true,
  });

  return Boolean(match && match.isExact);
}

function useHomeMeta() {
  const { t } = useTranslation();
  const activeLanguage = useLanguage();
  const unitDetailsMatch = useRouteMatch<Params>(routerPaths.unitDetails);

  const selectedUnit = useSelector<AppState, Unit>((state) =>
    getUnitById(state, {
      id: unitDetailsMatch?.params.unitId,
    })
  );

  const getTitle = () => {
    const title = [];

    if (selectedUnit) {
      title.push(`${getAttr(selectedUnit.name, activeLanguage) || ""} | `);
    }

    title.push(t("APP.NAME"));

    return title.join("");
  };

  const getDescription = () => {
    if (selectedUnit) {
      const description = selectedUnit.description;

      if (description) {
        return getAttr(description, activeLanguage);
      }
    }

    return t("APP.DESCRIPTION");
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

type MapLayoutProps = {
  content: ReactNode;
  map: ReactNode;
  title: string;
  description: string | null;
  image?: string | null;
};

function MapLayout({
  content,
  map,
  title,
  description,
  image,
}: MapLayoutProps) {
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
        <Page
          title={title}
          description={description}
          image={image}
          className="map-foreground-content"
        >
          {content}
        </Page>
      </div>
      <AppInfoDropdown />
      <div className="map-container">{map}</div>
    </>
  );
}

type Params = {
  unitId: string;
};

function HomeContainer() {
  const mapRef = useRef<RLMap | null>(null);
  const leafletElementRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();
  const { title, description, image } = useHomeMeta();

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
      title={title}
      description={description}
      image={image}
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
