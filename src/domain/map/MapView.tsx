import { LatLngTuple } from "leaflet";
import { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import HeightProfileControl from "./HeightProfileControl";
import Control from "./MapControl";
import MapEvents from "./MapEvents";
import MapUnitsOnMap from "./MapUnits";
import MapUserLocationMarker from "./MapUserLocationMarker";
import {
  BOUNDARIES,
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from "./mapConstants";
import { getMapUrl, latLngToArray } from "./mapHelpers";
import OSMIcon from "../../common/components/OSMIcon";
import { View } from "../unit/UnitView";
import { Unit } from "../unit/types";
import { isRetina } from "../utils";

type MapViewProps = {
  selectedUnit: Unit | undefined;
  onCenterMapToUnit: (unit: Unit, map: L.Map) => void;
  activeLanguage: string;
  openUnit: (unitId: string, unitName?: string) => void;
  setLocation: (coordinates: [number, number]) => void;
  leafletElementRef: MutableRefObject<L.Map | null>;
  position: LatLngTuple;
  units: Unit[];
};

function MapView(props: Readonly<MapViewProps>) {
  const { t, i18n } = useTranslation();
  const {
    position,
    selectedUnit,
    units,
    openUnit,
    leafletElementRef,
  } = props;

  const leafletElement = leafletElementRef.current;

  const locateUser = () => {
    leafletElement?.locate({
      setView: true,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (event: Record<string, any>) => {
    // Click events from info menu and language changer hit this. Don't
    // do anything for those events.
    if (event.originalEvent.target.localName !== "path" && event.originalEvent.target.className.includes("leaflet")) {
      setLocation(event);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setLocation = (event: Record<string, any>) => {
    const { setLocation } = props;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLocation((latLngToArray(event.latlng) as any) as [number, number]);
  };

  const unitHasLineString3dGeometry = (u: Unit) => u?.geometry_3d;
  const language = i18n.languages[0] || "fi";

  return (
    <View
      id="map-view"
      className="map-view"
      // Hide tha map from screen readers
      aria-label={t("MAP.ACCESSIBILITY_NOTICE")}
      aria-hidden="false"
      tabIndex={-1}
    >
      <MapContainer
        zoomControl={false}
        attributionControl={false}
        center={position}
        maxBounds={BOUNDARIES}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        ref={(map) => {
          if(!leafletElementRef.current) {
            leafletElementRef.current = map;
          }
        }}
      >
        <TileLayer
          url={
            getMapUrl(language, isRetina() ? "@3x" : "")
          }
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents
          handleMapClick={handleMapClick}
          setLocation={setLocation}
        />
        <MapUserLocationMarker/>
        <MapUnitsOnMap
          units={units}
          zoomLevel={DEFAULT_ZOOM}
          selectedUnit={selectedUnit}
          openUnit={openUnit}
        />
        <ZoomControl
          position="bottomright"
          zoomInTitle={t("MAP.ZOOM_IN")}
          zoomOutTitle={t("MAP.ZOOM_OUT")}
        />
        <Control
          handleClick={locateUser}
          className="leaflet-control-locate"
          position="bottomright"
        >
          <OSMIcon icon="locate" aria-label={t("MAP.LOCATE_USER")} />
        </Control>
        {selectedUnit && unitHasLineString3dGeometry(selectedUnit) && (
          <HeightProfileControl unit={selectedUnit} />
        )}
      </MapContainer>
    </View>
  );
}

export default MapView;
