import L from "leaflet";
import { Component } from "react";
import { WithTranslationProps, withTranslation } from "react-i18next";

import UnitGeometry from "./MapGeometry";
import UnitMarker from "./MapUnitMarker";
import { Unit } from "../unit/unitConstants";
import { getUnitQuality } from "../unit/unitHelpers";

type Props = WithTranslationProps & {
  unit: Unit;
  isSelected: boolean;
  zoomLevel: number;
  openUnit: (unitId: string, unitName?: string) => void;
};

class MapUnit extends Component<Props> {
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
    const { unit, openUnit, i18n } = this.props;

    L.DomEvent.stopPropagation(e);
    // @ts-ignore
    openUnit(unit.id, unit.name[i18n?.languages[0]]);
  }

  render() {
    const { unit, zoomLevel, isSelected, ...rest } = this.props;

    const geometry =
      unit.geometry?.type === "MultiLineString" ? unit.geometry : null;

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
            id={unit.id}
            geometry={unit.geometry}
            quality={getUnitQuality(unit)}
            isSelected={isSelected}
            handleClick={this.handleClick}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(MapUnit);
