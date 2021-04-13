// @flow

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as fromService from '../../service/selectors';
import getIsLoading from '../../home/selectors';
import * as fromUnit from '../selectors';
import SingleUnitModalContainer from './SingleUnitModalContainer';

type Props = {
  unitId: string,
  onCenterMapToUnit: (coordinates: [Number, number]) => void,
};

const UnitDetailsContainer = ({ unitId, onCenterMapToUnit }: Props) => {
  const serviceData = useSelector(fromService.getServicesObject);
  const selectedUnit = useSelector((state) =>
    fromUnit.getUnitById(state, { id: unitId })
  );
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    if (selectedUnit) {
      // Center map on the unit
      onCenterMapToUnit(selectedUnit);
    }
  }, [selectedUnit, onCenterMapToUnit]);

  return (
    <SingleUnitModalContainer
      isLoading={isLoading}
      isOpen={!!unitId}
      unit={selectedUnit}
      services={serviceData}
    />
  );
};

export default UnitDetailsContainer;
