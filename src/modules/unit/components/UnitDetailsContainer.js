// @flow

import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import * as fromService from '../../service/selectors';
import getIsLoading from '../../home/selectors';
import * as fromUnit from '../selectors';
import * as UnitHelpers from '../helpers';
import SingleUnitModalContainer from './SingleUnitModalContainer';

type Props = {
  unitId: string,
  onViewChange: (coordinates: [Number, number]) => void,
};

const UnitDetailsContainer = ({ unitId, onViewChange }: Props) => {
  const history = useHistory();
  const { search } = useLocation();
  const serviceData = useSelector(fromService.getServicesObject);
  const selectedUnit = useSelector((state) =>
    fromUnit.getUnitById(state, { id: unitId })
  );
  const isLoading = useSelector(getIsLoading);

  const closeUnit = useCallback(() => {
    history.push({
      pathname: '/',
      search,
    });
  }, [history, search]);

  useEffect(() => {
    if (selectedUnit) {
      // Center map on the unit
      onViewChange(UnitHelpers.getUnitPosition(selectedUnit));
    }
  }, [selectedUnit, onViewChange]);

  return (
    <SingleUnitModalContainer
      isLoading={isLoading}
      isOpen={!!unitId}
      unit={selectedUnit}
      services={serviceData}
      handleClick={closeUnit}
    />
  );
};

export default UnitDetailsContainer;
