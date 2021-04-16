import { useEffect } from "react";
import { useSelector } from "react-redux";

import { AppState } from "../../common/constants";
import getIsLoading from "../../home/selectors";
import * as fromService from "../../service/selectors";
import { Unit } from "../constants";
import * as fromUnit from "../selectors";
import SingleUnitContainer from "./SingleUnitContainer";

type Props = {
  unitId: string;
  onCenterMapToUnit: (unit: Unit) => void;
};

function UnitDetailsContainer({ unitId, onCenterMapToUnit }: Props) {
  const serviceData = useSelector(fromService.getServicesObject);

  const selectedUnit = useSelector<AppState, Unit>((state) =>
    fromUnit.getUnitById(state, {
      id: unitId,
    })
  );

  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    if (selectedUnit) {
      // Center map on the unit
      onCenterMapToUnit(selectedUnit);
    }
  }, [selectedUnit, onCenterMapToUnit]);

  return (
    <SingleUnitContainer
      isLoading={isLoading}
      isOpen={!!unitId}
      unit={selectedUnit}
      services={serviceData}
    />
  );
}

export default UnitDetailsContainer;
