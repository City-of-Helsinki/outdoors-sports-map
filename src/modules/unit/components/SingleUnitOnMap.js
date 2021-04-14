// @flow

import React, { Component } from 'react';
import L from 'leaflet';
import { getUnitQuality } from '../helpers';
import UnitMarker from './UnitMarker';
import UnitGeometry from './UnitGeometry';

type Props = {
  unit: Object,
  isSelected: boolean,
  zoomLevel: number,
  openUnit: (unitId: string) => void,
};

class SingleUnitOnMap extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    const { unit, isSelected, zoomLevel } = this.props;
    const isQualityUpdated =
      getUnitQuality(unit) !== getUnitQuality(nextProps.unit);
    const isSelectedUpdated = isSelected !== nextProps.isSelected;
    const isZoomUpdated = zoomLevel !== nextProps.zoomLevel;

    return isQualityUpdated || isSelectedUpdated || isZoomUpdated;
  }

  /*:: handleClick: Function */
  handleClick(e: SyntheticEvent<HTMLElement>) {
    const { unit, openUnit } = this.props;
    L.DomEvent.stopPropagation(e);

    openUnit(unit.id);
  }

  render() {
    const { unit, zoomLevel, isSelected, ...rest } = this.props;
    const geometry =
      unit.geometry && unit.geometry.type === 'MultiLineString'
        ? unit.geometry
        : null;

    return (
      <div>
        <UnitMarker
          unit={unit}
          zoomLevel={zoomLevel}
          isSelected={isSelected}
          handleClick={this.handleClick}
          {...rest}
        />
        {geometry && (
          <UnitGeometry
            unit={unit}
            onClick={this.handleClick}
            isSelected={isSelected}
          />
        )}
      </div>
    );
  }
}

export default SingleUnitOnMap;
