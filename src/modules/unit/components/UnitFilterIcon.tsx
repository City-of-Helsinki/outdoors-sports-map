import OSMIcon from "../../home/components/OSMIcon";
import { UnitFilters } from "../constants";

type Props = {
  filter: string;
  className?: string;
};

function UnitFilterIcon({ filter, ...rest }: Props) {
  const SKIING_ICON = "crosscountry";
  const STATUS_OK_ICON = "status-ok";
  const STATUS_ANY_ICON = "status-unknown";
  let iconName = filter;

  switch (filter) {
    case UnitFilters.SKIING:
      iconName = SKIING_ICON;
      break;

    case UnitFilters.STATUS_OK:
      iconName = STATUS_OK_ICON;
      break;

    case UnitFilters.STATUS_ALL:
      iconName = STATUS_ANY_ICON;
      break;

    default: // Use received filter
  }

  return <OSMIcon icon={iconName} {...rest} />;
}

export default UnitFilterIcon;
