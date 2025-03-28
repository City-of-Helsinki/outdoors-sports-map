import { Unit, UnitFilters } from "./unitConstants";
import { getUnitSport } from "./unitHelpers";
import OSMIcon from "../../common/components/OSMIcon";

type Props = {
  unit: Unit;
  alt?: string;
};

function UnitIcon({ unit, alt }: Props) {
  let icon = "status-unknown";

  switch (getUnitSport(unit)) {
    case UnitFilters.ICE_SKATING:
      icon = "iceskate";
      break;

    case UnitFilters.SKIING:
      icon = "crosscountry";
      break;

    case UnitFilters.SWIMMING:
      icon = "swim";
      break;

    case UnitFilters.ICE_SWIMMING:
      icon = "iceswim";
      break;

    case UnitFilters.SLEDDING:
      icon = "sledding";
      break;
    
    case UnitFilters.COOKING_FACILITY:
      icon = UnitFilters.COOKING_FACILITY;
      break;
    
    case UnitFilters.CAMPING:
      icon = UnitFilters.CAMPING;
      break;

    case UnitFilters.SKI_LODGE:
      icon = UnitFilters.SKI_LODGE;
      break;

    case UnitFilters.LEAN_TO:
      icon = UnitFilters.LEAN_TO;
      break;

    case UnitFilters.INFORMATION_POINT:
      icon = UnitFilters.INFORMATION_POINT;
      break;
    
    default: // Use default value
  }
  return <OSMIcon className="unit-icon" icon={icon} alt={alt} />;
}

export default UnitIcon;
