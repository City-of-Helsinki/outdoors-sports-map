import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";

import { AppState } from "../../common/constants";
import useSearch from "../../common/hooks/useSearch";
import changeLanguage from "../../language/actions";
import MapView from "../../unit/components/MapView";
import { SportFilter, StatusFilter, Unit } from "../../unit/constants";
import * as fromUnit from "../../unit/selectors";
import { setLocation } from "../actions";
import { MapRef } from "../constants";
import * as fromMap from "../selectors";

type Props = {
  selectedUnitId?: string | null;
  onCenterMapToUnit: (unit: Unit) => void;
  mapRef: MapRef;
};

function Map({ selectedUnitId, onCenterMapToUnit, mapRef }: Props) {
  const dispatch = useDispatch();

  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const history = useHistory();
  const { search } = useLocation();
  const { sport, status } = useSearch<{
    sport?: SportFilter;
    status: StatusFilter;
  }>();

  const unitData = useSelector<AppState, Unit[]>((state) =>
    fromUnit.getVisibleUnits(state, sport, status)
  );

  const selectedUnit = useSelector<AppState, Unit>((state) =>
    fromUnit.getUnitById(state, {
      id: selectedUnitId,
    })
  );

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
      mapRef={mapRef}
      selectedUnit={selectedUnit}
      activeLanguage={language}
      setLocation={actions.setLocation}
      position={initialPosition.current}
      units={unitData}
      openUnit={openUnit}
      onCenterMapToUnit={onCenterMapToUnit}
    />
  );
}

export default Map;
