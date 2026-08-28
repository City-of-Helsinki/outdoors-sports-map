import { LatLngTuple } from "leaflet";
import { MutableRefObject, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import Loading from "../../common/components/Loading";
import MapUnitsOnMap from "../map/MapUnits";
import {
  BOUNDARIES,
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from "../map/mapConstants";
import { getMapUrl } from "../map/mapHelpers";
import { View } from "../unit/UnitView";
import { Unit } from "../unit/types";
import { isRetina } from "../utils";

type EmbedMapProps = {
  units: Unit[];
  position: LatLngTuple;
  targetZoom?: number;
  isLoading: boolean;
  activeLanguage: string;
  selectedUnit?: Unit;
  onSelectUnit?: (unitId: string) => void;
};

function EmbedMap({
  units,
  position,
  targetZoom = DEFAULT_ZOOM,
  isLoading,
  activeLanguage,
  selectedUnit,
  onSelectUnit,
}: Readonly<EmbedMapProps>) {
  const { t } = useTranslation();
  const leafletRef: MutableRefObject<L.Map | null> = useRef(null);

  return (
    <View
      id="map-view"
      className="map-view embed-map"
      aria-label={t("MAP.ACCESSIBILITY_NOTICE")}
      aria-hidden="false"
      tabIndex={-1}
    >
      <MapContainer
        zoomControl={false}
        attributionControl={false}
        center={position}
        maxBounds={BOUNDARIES}
        zoom={targetZoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        ref={(map) => {
          if (!leafletRef.current) {
            leafletRef.current = map;
          }
        }}
      >
        <TileLayer
          url={getMapUrl(activeLanguage, isRetina() ? "@3x" : "")}
        />
        <MapUnitsOnMap
          units={units}
          zoomLevel={targetZoom}
          selectedUnit={selectedUnit}
          openUnit={onSelectUnit ?? (() => {})}
        />
        <ZoomControl
          position="bottomright"
          zoomInTitle={t("MAP.ZOOM_IN")}
          zoomOutTitle={t("MAP.ZOOM_OUT")}
        />
      </MapContainer>
      {isLoading && (
        <div className="map-view-loading-overlay">
          <div className="map-view-loading-container">
            <Loading />
          </div>
        </div>
      )}
    </View>
  );
}

export default EmbedMap;
