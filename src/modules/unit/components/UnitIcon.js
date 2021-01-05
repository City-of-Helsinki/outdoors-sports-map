/* eslint-disable react/prop-types */

import React from 'react';
import { getUnitSport } from '../helpers';
import { UnitFilters } from '../constants';
import OSMIcon from '../../home/components/OSMIcon';

const UnitIcon = ({ unit }) => {
  let icon = 'status-unknown';

  switch (getUnitSport(unit)) {
    case UnitFilters.ICE_SKATING:
      icon = 'iceskate';
      break;
    case UnitFilters.SKIING:
      icon = 'crosscountry';
      break;
    case UnitFilters.SWIMMING:
      icon = 'swim';
      break;
    default:
    // Use default value
  }

  return <OSMIcon className="unit-icon" icon={icon} />;
};

export default UnitIcon;
