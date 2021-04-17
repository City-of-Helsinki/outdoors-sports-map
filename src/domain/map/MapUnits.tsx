import isEmpty from "lodash/isEmpty";

import { Unit } from "../unit/unitConstants";
import { getUnitQuality, sortByCondition } from "../unit/unitHelpers";
import MapUnit from "./MapUnit";

type Props = {
  units: Unit[];
  selectedUnit: Unit;
  openUnit: (unitId: string) => void;
  zoomLevel: number;
};

function MapUnits({ units, selectedUnit, openUnit, zoomLevel }: Props) {
  let unitsInOrder = units.slice();
  const originalLength = unitsInOrder.length;

  // Draw things in condition order
  unitsInOrder = sortByCondition(unitsInOrder).reverse();

  if (!isEmpty(unitsInOrder) && selectedUnit) {
    unitsInOrder.push(selectedUnit);
  }

  return (
    <div className="units-on-map">
      {!isEmpty(unitsInOrder) &&
        unitsInOrder.map((unit, index) => (
          <MapUnit
            isSelected={selectedUnit && selectedUnit.id === unit.id}
            unit={unit}
            zoomLevel={zoomLevel}
            key={`${unit.id}:${getUnitQuality(unit)}:${
              index === originalLength
            }`}
            openUnit={openUnit}
          />
        ))}
    </div>
  );
}

export default MapUnits;
