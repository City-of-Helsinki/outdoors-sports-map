// @flow

import React, { Component } from 'react';
import { Marker } from 'react-leaflet';
import { getUnitIcon, getUnitPosition, getUnitSport } from '../helpers';
import { UNIT_ICON_WIDTH, UnitFilters } from '../constants';
import { MAX_ZOOM } from '../../map/constants';
import AriaHiddenIcon from '../../map/AriaHiddenIcon';
import UnitPopup from './UnitPopup';

const POPUP_OFFSET = 4;

type Props = {
  isSelected: boolean,
  zoomLevel: number,
  unit: Object,
  handleClick: () => void,
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

  getIconHeight = (icon: Object, zoomLevel: number) =>
    (zoomLevel / MAX_ZOOM) * icon.height;

  _getAnchorHeight = (iconHeight: number, unit: Object) =>
    getUnitSport(unit) === UnitFilters.SKIING ? iconHeight / 2 : iconHeight;

  _getPopupOffset = (unit: Object) =>
    -(getUnitSport(unit) === UnitFilters.SKIING
      ? POPUP_OFFSET
      : POPUP_OFFSET + 24);

  setMarkerRef = (ref: ?Object) => {
    this.markerRef = ref;
  };

  /*:: openPopup: Function */
  openPopup() {
    // $FlowIgnore
    this.markerRef.leafletElement.openPopup();
  }

  _createIcon(unit: Object, isSelected: boolean) {
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
    // $FlowIgnore
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
