import React, {Component} from 'react';
import L from 'leaflet';
import {getUnitQuality} from '../helpers';
import UnitMarker from './UnitMarker';
import UnitGeometry from './UnitGeometry';

export class SingleUnitOnMap extends Component{

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {unit, openUnit} = this.props;
    L.DomEvent.stopPropagation(e);

    openUnit(unit.id);
  }

  shouldComponentUpdate(nextProps) {
    const {unit, isSelected, zoomLevel} = this.props;
    const isQualityUpdated = getUnitQuality(unit) !== getUnitQuality(nextProps.unit);
    const isSelectedUpdated = isSelected !== nextProps.isSelected;
    const isZoomUpdated = zoomLevel !== nextProps.zoomLevel;

    return isQualityUpdated || isSelectedUpdated || isZoomUpdated;
  }

  render () {
    const {unit, zoomLevel, isSelected, ...rest} = this.props;
    const geometry = unit.geometry && unit.geometry.type === 'MultiLineString' ? unit.geometry : null;

    return(
      <div>
        <UnitMarker unit={unit} zoomLevel={zoomLevel} isSelected={isSelected} handleClick={this.handleClick} {...rest}/>
        {geometry && <UnitGeometry unit={unit} onClick={this.handleClick} isSelected={isSelected}/> }
      </div>
    );
  }
}

export default SingleUnitOnMap;