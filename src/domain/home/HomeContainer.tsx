import className from "classnames";
import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Map as RLMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import Page from "../../common/a11y/Page";
import useIsMobile from "../../common/hooks/useIsMobile";
import ApplicationHeader from "../app/ApplicationHeader";
import { AppState } from "../app/appConstants";
import routerPaths from "../app/appRoutes";
import { languageParam } from "../i18n/i18nConstants";
import Map from "../map/Map";
import { MapRef } from "../map/mapConstants";
import { fetchServices } from "../service/actions";
import UnitBrowser from "../unit/browser/UnitBrowser";
import UnitDetails from "../unit/details/UnitDetails";
import { fetchUnits } from "../unit/state/actions";
import { getUnitById } from "../unit/state/selectors";
import { Unit } from "../unit/unitConstants";
import { getAttr, getUnitPosition } from "../unit/unitHelpers";

function getLeafletMap(ref: MapRef) {
  return ref.current?.leafletElement;
}

function useIsUnitBrowserView() {
  const match = useRouteMatch({
    path: ["/", `/${languageParam}`],
    exact: true,
  });

  return Boolean(match && match.isExact);
}

function useHomeMeta(selectedUnitId?: string | null) {
  const {
    t,
    i18n: {
      languages: [activeLanguage],
    },
  } = useTranslation();

  const selectedUnit = useSelector<AppState, Unit>((state) =>
    getUnitById(state, {
      id: selectedUnitId,
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

function getLatLngToContainerPoint(ref: MapRef, location: [number, number]) {
  return ref.current?.leafletElement.latLngToContainerPoint(location);
}

function getContainerPointToLatLng(ref: MapRef, location: L.Point) {
  return ref.current?.leafletElement.containerPointToLatLng(location);
}

function setView(ref: MapRef, coordinates: L.LatLng) {
  ref.current?.leafletElement.setView(coordinates);
}

type MapLayoutProps = {
  content: ReactNode;
  map: ReactNode;
  isFilled: boolean;
  title: string;
  description: string | null;
  image?: string | null;
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
        className={className("map-foreground", {
          "is-filled": isFilled,
          "fill-color-content": !isUnitBrowserView,
          "fill-color-background": isUnitBrowserView,
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
  const mapRef = useRef<RLMap>(null);
  const [isExpanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const match = useRouteMatch<{ unitId: string }>(routerPaths.singleUnit);
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

      if (!location) {
        return;
      }

      const pixelLocation = getLatLngToContainerPoint(mapRef, location);

      if (!pixelLocation) {
        return;
      }

      if (!isMobile) {
        // Offset by half the width of unit modal in order to center focus
        // on the visible map
        pixelLocation.x -= 200;

        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        if (adjustedCenter) {
          setView(mapRef, adjustedCenter);
        }
      } else {
        // On mobile we want to move the map 250px down from the center, so the
        // big info box does not hide the selected unit.
        pixelLocation.y -= 250;

        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        if (adjustedCenter) {
          setView(mapRef, adjustedCenter);
        }
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
            className={className("map-foreground-unit-browser", {
              // Hide unit browser when the unit details is open with styling.
              // This is an easy way to retain the search state.
              hidden: isUnitDetailsOpen,
            })}
          >
            <UnitBrowser
              leafletMap={getLeafletMap(mapRef)}
              onViewChange={handleOnViewChange}
              expandedState={[isExpanded, setExpanded]}
            />
          </div>
          {isUnitDetailsOpen && typeof selectedUnitId === "string" && (
            <UnitDetails
              unitId={selectedUnitId}
              onCenterMapToUnit={handleCenterMapToUnit}
            />
          )}
        </>
      }
      map={
        <Map
          mapRef={mapRef}
          selectedUnitId={selectedUnitId}
          onCenterMapToUnit={handleCenterMapToUnit}
        />
      }
    />
  );
}

export default HomeContainer;
