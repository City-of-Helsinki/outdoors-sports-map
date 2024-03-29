import get from "lodash/get";
import { Component, RefObject } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Map, TileLayer, ZoomControl } from "react-leaflet";

import Control from "./MapControl";
import MapUnitsOnMap from "./MapUnits";
import MapUserLocationMarker from "./MapUserLocationMarker";
import {
  BOUNDARIES,
  DEFAULT_ZOOM,
  MapRef,
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
  onCenterMapToUnit: (unit: Unit) => void;
  activeLanguage: string;
  openUnit: (unitId: string, unitName?: string) => void;
  setLocation: (coordinates: number[]) => void;
  position: [number, number];
  units: Unit[];
  mapRef: MapRef;
  leafletElementRef: RefObject<L.Map | null>;
};

type State = {
  zoomLevel: number;
};

class MapView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      zoomLevel: DEFAULT_ZOOM,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { selectedUnit, onCenterMapToUnit } = this.props;

    if (
      selectedUnit &&
      (!prevProps.selectedUnit || selectedUnit.id !== prevProps.selectedUnit.id)
    ) {
      onCenterMapToUnit(selectedUnit);
    }
  }

  get leafletElement() {
    const { leafletElementRef } = this.props;

    return leafletElementRef?.current;
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

  handleClick = (event: Record<string, any>) => {
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

  setView = (coordinates: [number, number]) => {
    this.leafletElement?.setView(coordinates);
  };

  render() {
    const {
      position,
      selectedUnit,
      units,
      openUnit,
      mapRef,
      t,
      i18n: {
        languages: [language],
      },
    } = this.props;

    const { zoomLevel } = this.state;

    return (
      <View
        id="map-view"
        className="map-view"
        // Hide tha map from screen readers
        aria-label={t("MAP.ACCESSIBILITY_NOTICE")}
        aria-hidden="false"
        tabIndex={-1}
      >
        <Map
          ref={mapRef}
          zoomControl={false}
          attributionControl={false}
          center={position}
          maxBounds={BOUNDARIES}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onclick={this.handleClick}
          onlocationfound={this.setLocation}
          onzoomend={this.handleZoom}
        >
          <TileLayer
            url={
              isRetina()
                ? get(MAP_RETINA_URL, language)
                : get(MAP_URL, language)
            }
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUserLocationMarker />
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
        </Map>
      </View>
    );
  }
}

export default withTranslation(undefined, {
  withRef: true,
})(MapView);
