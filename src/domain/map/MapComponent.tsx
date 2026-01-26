import { RefObject, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

import MapView from "./MapView";
import { setLocation, useLazyGetAddressQuery, selectLocation } from "./state/mapSlice";
import useLanguage from "../../common/hooks/useLanguage";
import * as PathUtils from "../../common/utils/pathUtils";
import routerPaths from "../app/appRoutes";
import { AppState, AppSearchLocationState } from "../app/types";
import useAppSearch from "../app/useAppSearch";
import { selectVisibleUnits, selectUnitById, selectIsMapLoading, useGetUnitByIdQuery } from "../unit/state/unitSlice";
import { Unit } from "../unit/types";
import { handleSingleUnitConditionUpdate } from "../unit/unitHelpers";

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
  
  const isMapLoading = useSelector(selectIsMapLoading);
  
  // Get the basic unit from the regular units array
  const basicSelectedUnit = useSelector<AppState, Unit>((state) =>
    selectUnitById(state, {
      id: unitDetailsMatch?.params?.unitId,
    })
  );
  
  // Get detailed unit data with 3D geometry if we have a unit selected
  const { data: detailedSelectedUnit } = useGetUnitByIdQuery(unitDetailsMatch?.params?.unitId || "", {
    skip: !unitDetailsMatch?.params?.unitId,
  });

  // Apply condition updates to detailed selected unit to keep it in sync with the units list
  const selectedUnitWithUpdatedCondition = useMemo(() => 
    detailedSelectedUnit 
      ? handleSingleUnitConditionUpdate(detailedSelectedUnit) 
      : null, 
  [detailedSelectedUnit]);
  
  // Only set selectedUnit when on unit details page
  const selectedUnit = unitDetailsMatch?.params?.unitId 
    ? (selectedUnitWithUpdatedCondition || basicSelectedUnit)
    : undefined;
  
  // Use unitData if available, otherwise show selectedUnit as backup only when on unit details page
  const unitsToShow = useMemo(() => {
    if (unitData.length) {
      return unitData;
    }
    if (selectedUnit) {
      return [selectedUnit];
    }
    return [];
  }, [unitData, selectedUnit]);
  
  const position = useSelector(selectLocation);
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
      if (unitDetailsMatch?.params?.unitId) {
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
      unitDetailsMatch?.params?.unitId,
    ]
  );

  return (
    <MapView
      selectedUnit={selectedUnit}
      activeLanguage={language}
      setLocation={handleSetLocation}
      leafletElementRef={leafletElementRef}
      position={position}
      units={unitsToShow}
      openUnit={openUnit}
      onCenterMapToUnit={onCenterMapToUnit}
      isLoading={isMapLoading}
    />
  );
}

export default MapComponent;
