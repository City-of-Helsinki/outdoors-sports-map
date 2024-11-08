import { LatLngTuple } from "leaflet";
import get from "lodash/get";
import { Component, MutableRefObject } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import HeightProfileControl from "./HeightProfileControl";
import Control from "./MapControl";
import MapEvents from "./MapEvents";
import MapUnitsOnMap from "./MapUnits";
import MapUserLocationMarker from "./MapUserLocationMarker";
import {
  BOUNDARIES,
  DEFAULT_ZOOM,
  MAP_RETINA_URL,
  MAP_URL,
  MAX_ZOOM,
  MIN_ZOOM,
} from "./mapConstants";
import latLngToArray from "./mapHelpers";
import OSMIcon from "../../common/components/OSMIcon";
import { View } from "../unit/UnitView";
import { Unit } from "../unit/unitConstants";
import { isRetina } from "../utils";

type Props = WithTranslation & {
  selectedUnit: Unit;
  onCenterMapToUnit: (unit: Unit, map: L.Map) => void;
  activeLanguage: string;
  openUnit: (unitId: string, unitName?: string) => void;
  setLocation: (coordinates: number[]) => void;
  leafletElementRef: MutableRefObject<L.Map | null>;
  position: LatLngTuple;
  units: Unit[];
};

type State = {
  zoomLevel: number;
  leafletElement: L.Map | null;
};

class MapView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      zoomLevel: DEFAULT_ZOOM,
      leafletElement: null,
    };
  }

  get leafletElement() {
    const { leafletElementRef } = this.props;
    return leafletElementRef.current;
  }

  handleZoom = () => {
    this.setState({
      zoomLevel: this.leafletElement?.getZoom() || DEFAULT_ZOOM,
    });
  };

  locateUser = () => {
    this.leafletElement?.locate({
      setView: true,
    });
  };

  handleMapClick = (event: Record<string, any>) => {
    // Click events from info menu and language changer hit this. Don't
    // do anything for those events.
    if (event.originalEvent.target.localName !== "path" && event.originalEvent.target.className.includes("leaflet")) {
      this.setLocation(event);
    }
  };

  setLocation = (event: Record<string, any>) => {
    const { setLocation } = this.props;
    setLocation((latLngToArray(event.latlng) as any) as [number, number]);
  };

  render() {
    const {
      position,
      selectedUnit,
      units,
      openUnit,
      t,
      i18n: {
        languages: [language],
      },
    } = this.props;

    const { zoomLevel } = this.state;

    const unitHasLineString3dGeometry = (u: Unit) => u?.geometry_3d;

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
            const { leafletElementRef } = this.props;
            if(!leafletElementRef.current) {
              leafletElementRef.current = map;
            }
          }}
        >
          <TileLayer
            url={
              isRetina()
                ? get(MAP_RETINA_URL, language)
                : get(MAP_URL, language)
            }
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents
            handleMapClick={this.handleMapClick}
            setLocation={this.setLocation} />
          <MapUserLocationMarker/>
          <MapUnitsOnMap
            units={units}
            zoomLevel={zoomLevel}
            selectedUnit={selectedUnit}
            openUnit={openUnit}
          />
          <ZoomControl
            position="bottomright"
            zoomInTitle={t("MAP.ZOOM_IN")}
            zoomOutTitle={t("MAP.ZOOM_OUT")}
          />
          <Control
            handleClick={this.locateUser}
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
}

export default withTranslation(undefined, {
  withRef: true,
})(MapView);
