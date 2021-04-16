// @ts-ignore
import React, { forwardRef, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
// @ts-ignore

import changeLanguage from "../../language/actions";
import * as fromService from "../../service/selectors";
import MapView from "../../unit/components/MapView";
import * as fromUnit from "../../unit/selectors";
import { setLocation } from "../actions";
import * as fromMap from "../selectors";

type Props = {
  selectedUnitId: String;
  onCenterMapToUnit: (unit: Record<string, any>) => void;
};

const Map = forwardRef(({ selectedUnitId, onCenterMapToUnit }: Props, ref) => {
  const dispatch = useDispatch();

  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const history = useHistory();
  const { search } = useLocation();

  const unitData = useSelector((state) =>
    fromUnit.getVisibleUnits(state, search)
  );

  const serviceData = useSelector(fromService.getServicesObject);

  const selectedUnit = useSelector((state) =>
    fromUnit.getUnitById(state, {
      id: selectedUnitId,
    })
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
      // Store current search so it can be re-applied if the user returns from
      // the unit details view
      history.push(`/${language}/unit/${unitId}`, {
        search,
      });
    },
    [history, search, language]
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
      onCenterMapToUnit={onCenterMapToUnit}
    />
  );
});

export default Map;
