import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";

import useLanguage from "../../common/hooks/useLanguage";
import useSearch from "../../common/hooks/useSearch";
import { AppState } from "../app/appConstants";
import * as fromUnit from "../unit/state/selectors";
import { SportFilter, StatusFilter, Unit } from "../unit/unitConstants";
import MapView from "./MapView";
import { MapRef } from "./mapConstants";
import { setLocation } from "./state/actions";
import * as fromMap from "./state/selectors";

type Props = {
  selectedUnitId?: string | null;
  onCenterMapToUnit: (unit: Unit) => void;
  mapRef: MapRef;
};

function Map({ selectedUnitId, onCenterMapToUnit, mapRef }: Props) {
  const dispatch = useDispatch();
  const language = useLanguage();
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
