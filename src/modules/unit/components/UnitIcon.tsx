/* eslint-disable react/prop-types */
import React from "react";

import OSMIcon from "../../home/components/OSMIcon";
import { UnitFilters } from "../constants";
import { getUnitSport } from "../helpers";

function UnitIcon({ unit }) {
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

  return <OSMIcon className="unit-icon" icon={icon} />;
}

export default UnitIcon;
