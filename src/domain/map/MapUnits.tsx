import isEmpty from "lodash/isEmpty";

import MapUnit from "./MapUnit";
import { Unit } from "../unit/unitConstants";
import { getUnitQuality, sortByCondition } from "../unit/unitHelpers";

type Props = {
  units: Unit[];
  selectedUnit: Unit;
  openUnit: (unitId: string, unitName?: string) => void;
  zoomLevel: number;
};

function MapUnits({ units, selectedUnit, openUnit, zoomLevel }: Props) {
  let unitsInOrder = units.slice();
  const originalLength = unitsInOrder.length;

  // Draw things in condition order
  unitsInOrder = sortByCondition(unitsInOrder).reverse();
  unitsInOrder = selectedUnit
    ? unitsInOrder.filter((unit) => unit.id !== selectedUnit.id)
    : unitsInOrder;

  return (
    <div className="units-on-map">
      {selectedUnit && (
        <MapUnit
          isSelected={true}
          unit={selectedUnit}
          zoomLevel={zoomLevel}
          key={`${selectedUnit.id}:${getUnitQuality(selectedUnit)}`}
          openUnit={openUnit}
        />
      )}
      {!isEmpty(unitsInOrder) &&
        unitsInOrder.map((unit, index) => (
          <MapUnit
            isSelected={false}
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
