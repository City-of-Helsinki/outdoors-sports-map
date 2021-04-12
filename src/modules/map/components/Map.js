// @flow

import React, { useCallback, forwardRef, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import * as fromUnit from '../../unit/selectors';
import MapView from '../../unit/components/MapView';
import * as fromService from '../../service/selectors';
import changeLanguage from '../../language/actions';
import { setLocation } from '../actions';
import * as fromMap from '../selectors';

type Props = {
  selectedUnitId: String,
};

const Map = forwardRef(({ selectedUnitId }: Props, ref) => {
  const dispatch = useDispatch();
  const {
    i18n: { language },
  } = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const unitData = useSelector((state) =>
    fromUnit.getVisibleUnits(state, search)
  );
  const serviceData = useSelector(fromService.getServicesObject);
  const selectedUnit = useSelector((state) =>
    fromUnit.getUnitById(state, { id: selectedUnitId })
  );
  const mapCenter = useSelector(fromMap.getLocation);
  const position = useSelector(fromMap.getLocation);
  const actions = bindActionCreators(
    {
      setLocation,
      changeLanguage,
    },
    dispatch
  );
  const initialPosition = useRef(position);

  const openUnit = useCallback(
    (unitId: string) => {
      history.push({
        pathname: `/unit/${unitId}`,
        search,
      });
    },
    [history, search]
  );

  return (
    <MapView
      ref={ref}
      selectedUnit={selectedUnit}
      activeLanguage={language}
      setLocation={actions.setLocation}
      position={initialPosition.current}
      units={unitData}
      services={serviceData}
      changeLanguage={actions.changeLanguage}
      openUnit={openUnit}
      mapCenter={mapCenter}
    />
  );
});

export default Map;
