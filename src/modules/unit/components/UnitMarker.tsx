import React, { Component } from "react";
import { Marker } from "react-leaflet";

import AriaHiddenIcon from "../../map/AriaHiddenIcon";
import { MAX_ZOOM } from "../../map/constants";
import { UNIT_ICON_WIDTH, UnitFilters } from "../constants";
import { getUnitIcon, getUnitPosition, getUnitSport } from "../helpers";
import UnitPopup from "./UnitPopup";

const POPUP_OFFSET = 4;

type Props = {
  isSelected: boolean;
  zoomLevel: number;
  unit: Record<string, any>;
  handleClick: () => void;
};

class UnitMarker extends Component<Props> {
  markerRef = null;

  constructor(props: Props) {
    super(props);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getIconWidth = this.getIconWidth.bind(this);
    this.getIconHeight = this.getIconHeight.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    const { isSelected } = this.props;

    if (!isSelected && prevProps.isSelected) {
      this.closePopup();
    }
  }

  getIconWidth = (zoomLevel: number) =>
    (zoomLevel / MAX_ZOOM) * UNIT_ICON_WIDTH;

  getIconHeight = (icon: Record<string, any>, zoomLevel: number) =>
    (zoomLevel / MAX_ZOOM) * icon.height;

  _getAnchorHeight = (iconHeight: number, unit: Record<string, any>) =>
    getUnitSport(unit) === UnitFilters.SKIING ? iconHeight / 2 : iconHeight;

  _getPopupOffset = (unit: Record<string, any>) =>
    -(getUnitSport(unit) === UnitFilters.SKIING
      ? POPUP_OFFSET
      : POPUP_OFFSET + 24);

  setMarkerRef = (ref: Record<string, any> | null | undefined) => {
    this.markerRef = ref;
  };

  /*:: openPopup: Function */
  openPopup() {
    this.markerRef.leafletElement.openPopup();
  }

  _createIcon(unit: Record<string, any>, isSelected: boolean) {
    const { zoomLevel } = this.props;
    const icon = getUnitIcon(unit, isSelected);
    const iconWidth = this.getIconWidth(zoomLevel);
    const iconHeight = this.getIconHeight(icon, zoomLevel);
    const anchorHeight = this._getAnchorHeight(iconHeight, unit);

    return new AriaHiddenIcon({
      iconUrl: icon.url,
      iconRetinaUrl: icon.retinaUrl,
      iconSize: [iconWidth, iconHeight],
      iconAnchor: [iconWidth / 2, anchorHeight],
    });
  }

  /*:: closePopup: Function */
  closePopup() {
    this.markerRef.leafletElement.closePopup();
  }

  render() {
    const { unit, isSelected, handleClick, ...rest } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <Marker
        ref={this.setMarkerRef}
        position={getUnitPosition(unit)}
        icon={this._createIcon(unit, isSelected)}
        onClick={handleClick}
        onMouseOver={this.openPopup}
        onMouseOut={this.closePopup}
        {...rest}
      >
        <UnitPopup unit={unit} offset={this._getPopupOffset(unit)} />
      </Marker>
    );
  }
}

export default UnitMarker;
