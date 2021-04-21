import { RefObject, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { bindActionCreators } from "redux";

import useLanguage from "../../common/hooks/useLanguage";
import * as PathUtils from "../../common/utils/pathUtils";
import { AppState } from "../app/appConstants";
import routerPaths from "../app/appRoutes";
import useAppSearch from "../app/useAppSearch";
import * as fromUnit from "../unit/state/selectors";
import { Unit } from "../unit/unitConstants";
import MapView from "./MapView";
import { MapRef } from "./mapConstants";
import { setLocation } from "./state/actions";
import * as fromMap from "./state/selectors";

type Props = {
  onCenterMapToUnit: (unit: Unit) => void;
  mapRef: MapRef;
  leafletElementRef: RefObject<L.Map | null>;
};

function Map({ onCenterMapToUnit, mapRef, leafletElementRef }: Props) {
  const dispatch = useDispatch();
  const language = useLanguage();
  const history = useHistory();
  const { search, pathname } = useLocation();
  const appSearch = useAppSearch();
  const unitDetailsMatch = useRouteMatch<{ unitId: string }>(
    routerPaths.unitDetails
  );
  const unitData = useSelector<AppState, Unit[]>((state) =>
    fromUnit.getVisibleUnits(state, appSearch.sport, appSearch.status)
  );
  const selectedUnit = useSelector<AppState, Unit>((state) =>
    fromUnit.getUnitById(state, {
      id: unitDetailsMatch?.params?.unitId,
    })
  );
  const position = useSelector(fromMap.getLocation);
  const initialPosition = useRef(position);

  const actions = bindActionCreators(
    {
      setLocation,
    },
    dispatch
  );

  const openUnit = useCallback(
    (unitId: string) => {
      // Store current search state so it can be re-applied if the user returns
      // from the unit details view
      history.push(`/${language}/unit/${unitId}`, {
        previous: `${PathUtils.removeLanguageFromPathname(pathname)}${search}`,
        search: appSearch,
      });
    },
    [history, search, language, pathname, appSearch]
  );

  return (
    <MapView
      mapRef={mapRef}
      leafletElementRef={leafletElementRef}
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
