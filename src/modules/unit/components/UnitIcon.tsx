import OSMIcon from "../../home/components/OSMIcon";
import { Unit, UnitFilters } from "../constants";
import { getUnitSport } from "../helpers";

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

    default: // Use default value
  }

  return <OSMIcon className="unit-icon" icon={icon} alt={alt} />;
}

export default UnitIcon;
