import { RefObject, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

import MapView from "./MapView";
import { setLocation, useLazyGetAddressQuery, selectLocation } from "./state/mapSlice";
import useLanguage from "../../common/hooks/useLanguage";
import * as PathUtils from "../../common/utils/pathUtils";
import { AppState } from "../app/appConstants";
import { AppSearchLocationState } from "../app/appConstants";
import routerPaths from "../app/appRoutes";
import useAppSearch from "../app/useAppSearch";
import { selectVisibleUnits, selectUnitById } from "../unit/state/unitSlice";
import { Unit } from "../unit/unitConstants";

type Props = {
  onCenterMapToUnit: (unit: Unit, map: L.Map) => void;
  leafletElementRef: RefObject<L.Map | null>;
};

function MapComponent({ onCenterMapToUnit, leafletElementRef }: Props) {
  const dispatch = useDispatch();
  const language = useLanguage();
  const history = useHistory();
  const {
    search,
    pathname,
    state: locationState,
  } = useLocation<AppSearchLocationState>();
  const appSearch = useAppSearch();
  const unitDetailsMatch = useRouteMatch<{ unitId: string }>(
    routerPaths.unitDetails
  );
  const unitData = useSelector<AppState, Unit[]>((state) =>
    selectVisibleUnits(state, appSearch.sport, appSearch.status, appSearch.sportSpecification)
  );
  const selectedUnit = useSelector<AppState, Unit>((state) =>
    selectUnitById(state, {
      id: unitDetailsMatch?.params?.unitId,
    })
  );
  const position = useSelector(selectLocation);
  const initialPosition = useRef(position);
  const [triggerGetAddress] = useLazyGetAddressQuery();

  const handleSetLocation = useCallback(
    (coordinates: [number, number]) => {
      dispatch(setLocation(coordinates));
      // Trigger reverse geocoding
      triggerGetAddress({ lat: coordinates[0], lon: coordinates[1] });
    },
    [dispatch, triggerGetAddress]
  );

  const openUnit = useCallback(
    (unitId: string, unitName?: string) => {
      let state: AppSearchLocationState = {
        previous: `${PathUtils.removeLanguageFromPathname(pathname)}${search}`,
        search: appSearch,
      };
      let nextPathname = `/${language}/unit/${unitId}`;

      // If the user opens an unit while an unit is already open, inherit the
      // location state from search
      if (selectedUnit?.id) {
        state = {
          previous: locationState?.previous,
          search: locationState?.search,
        };
      }
      // If the unit has a name in the current language, use it in the url
      if (unitName) {
        nextPathname = `/${language}/unit/${unitId}-${encodeURIComponent(
          encodeURIComponent(unitName)
        )}`;
      }

      // Store current search state so it can be re-applied if the user returns
      // from the unit details view
      history.push(nextPathname, state);
    },
    [
      history,
      search,
      language,
      pathname,
      appSearch,
      locationState,
      selectedUnit?.id,
    ]
  );

  return (
    <MapView
      selectedUnit={selectedUnit}
      activeLanguage={language}
      setLocation={handleSetLocation}
      leafletElementRef={leafletElementRef}
      position={initialPosition.current}
      units={unitData}
      openUnit={openUnit}
      onCenterMapToUnit={onCenterMapToUnit}
    />
  );
}

export default MapComponent;
