import isEmpty from "lodash/isEmpty";

import { Unit } from "../constants";
import { getUnitQuality, sortByCondition } from "../helpers";
import SingleUnitOnMap from "./SingleUnitOnMap";

type Props = {
  units: Unit[];
  selectedUnit: Unit;
  openUnit: (unitId: string) => void;
  zoomLevel: number;
};

function UnitsOnMap({ units, selectedUnit, openUnit, zoomLevel }: Props) {
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
          <SingleUnitOnMap
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

export default UnitsOnMap;
