import OSMIcon from "../../../../common/components/OSMIcon";
import { UnitFilters } from "../../unitConstants";

type Props = {
  filter: string;
  className?: string;
};

function UnitBrowserFilterIcon({ filter, ...rest }: Props) {
  const SKIING_ICON = "crosscountry";
  const STATUS_OK_ICON = "status-ok";
  const STATUS_ANY_ICON = "status-unknown";
  const HIKING_ICON = "hiking";
  const SLEDDING_ICON = "sledding";
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
    
    case UnitFilters.HIKING:
      iconName = HIKING_ICON;
      break;
    
    case UnitFilters.SLEDDING:
      iconName = SLEDDING_ICON;
      break; // is this needed?

    default: // Use received filter
  }

  return <OSMIcon icon={iconName} {...rest} />;
}

export default UnitBrowserFilterIcon;
