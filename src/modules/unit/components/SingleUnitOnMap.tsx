import L from "leaflet";
import { Component } from "react";

import { Unit } from "../constants";
import { getUnitQuality } from "../helpers";
import UnitGeometry from "./UnitGeometry";
import UnitMarker from "./UnitMarker";

type Props = {
  unit: Unit;
  isSelected: boolean;
  zoomLevel: number;
  openUnit: (unitId: string) => void;
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

  handleClick(e: L.LeafletMouseEvent) {
    const { unit, openUnit } = this.props;

    L.DomEvent.stopPropagation(e);
    openUnit(unit.id);
  }

  render() {
    const { unit, zoomLevel, isSelected, ...rest } = this.props;

    const geometry =
      unit.geometry && unit.geometry.type === "MultiLineString"
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
        {geometry && <UnitGeometry unit={unit} isSelected={isSelected} />}
      </div>
    );
  }
}

export default SingleUnitOnMap;
