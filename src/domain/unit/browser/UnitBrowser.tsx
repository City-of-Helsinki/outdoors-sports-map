import values from "lodash/values";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";

import useSearch from "../../../common/hooks/useSearch";
import { Address, AppState } from "../../app/appConstants";
import * as fromHome from "../../app/appSelectors";
import * as fromMap from "../../map/state/selectors";
import * as fromUnitSearch from "../state/search/selectors";
import * as fromUnit from "../state/selectors";
import {
  SportFilter,
  StatusFilter,
  StatusFilters,
  Unit,
} from "../unitConstants";
import {
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getOffSeasonSportFilters,
  getOnSeasonSportFilters,
} from "../unitHelpers";
import UnitBrowserAddressBar from "./UnitBrowserAddressBar";
import UnitBrowserHeader from "./UnitBrowserHeader";
import UnitBrowserFilters from "./filter/UnitBrowserFilter";
import UnitBrowserResultList from "./resultList/UnitBrowserResultList";

function calculateMaxHeight() {
  const element = document.getElementById("always-visible");

  if (element) {
    const fixedPartHeight = element.offsetHeight;

    return window.innerHeight - fixedPartHeight;
  }

  return window.innerHeight;
}

function useOnResize(callback: () => void) {
  useCallback(() => {
    window.addEventListener("resize", callback);

    return () => {
      window.removeEventListener("resize", callback);
    };
  }, [callback]);
}

function useDoSearch() {
  const { search } = useLocation();
  const history = useHistory();

  const doSearch = useCallback(
    (key: string, value: string) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set(key, value);
      history.replace({
        search: searchParams.toString(),
      });
    },
    [history, search]
  );

  return doSearch;
}

type Props = {
  leafletMap: L.Map | null | undefined;
  onViewChange: (coordinates: [number, number]) => void;
  expandedState: [boolean, (value: boolean) => void];
};

type Params = {
  unitId?: string;
};

type Search = {
  sport: SportFilter;
  status: StatusFilter;
};

function UnitBrowser({
  onViewChange,
  leafletMap,
  expandedState: [isExpanded, setIsExpanded],
}: Props) {
  const { t } = useTranslation();
  const [contentMaxHeight, setContentMaxHeight] = useState<number>();
  const params = useParams<Params>();
  const doSearch = useDoSearch();
  const {
    sport = getDefaultSportFilter(),
    status = getDefaultStatusFilter(),
  } = useSearch<Search>();
  const units = useSelector<AppState, Unit[]>((state) =>
    fromUnit.getVisibleUnits(state, sport, status)
  );
  const isLoading = useSelector<AppState, boolean>(fromHome.getIsLoading);
  const isSearching = useSelector<AppState, boolean>(
    fromUnitSearch.getIsFetching
  );
  const position = useSelector<AppState, [number, number]>(fromMap.getLocation);
  const address = useSelector<AppState, Address | undefined | null>(
    fromMap.getAddress
  );

  useOnResize(
    useCallback(() => {
      setContentMaxHeight(calculateMaxHeight());
    }, [])
  );

  const handleExpand = () => {
    setIsExpanded(true);
  };
  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const singleUnitSelected = !!params.unitId;

  return (
    <div
      className={`unit-browser ${isExpanded ? "expanded" : ""}`}
      style={
        params.unitId
          ? {
              display: "none",
            }
          : undefined
      }
    >
      <div id="always-visible" className="unit-browser__fixed">
        <UnitBrowserHeader
          expand={handleExpand}
          collapse={handleCollapse}
          onViewChange={onViewChange}
          isExpanded={isExpanded}
        />
        {!isLoading && (
          <UnitBrowserFilters
            filters={[
              {
                name: "sport",
                active: sport,
                options: getOnSeasonSportFilters(),
                secondaryOptions: getOffSeasonSportFilters(),
              },
              {
                name: "status",
                active: status,
                options: values(StatusFilters),
              },
            ]}
            updateFilter={doSearch}
          />
        )}
        {!isLoading && address && Object.keys(address).length !== 0 && (
          <UnitBrowserAddressBar handleClick={onViewChange} address={address} />
        )}
      </div>
      <div
        className="unit-browser__content"
        style={{
          maxHeight: isExpanded
            ? contentMaxHeight || calculateMaxHeight()
            : contentMaxHeight,
        }}
      >
        {leafletMap && (
          <UnitBrowserResultList
            activeFilter={`${sport};${status}`}
            isVisible={isExpanded && !singleUnitSelected}
            isLoading={isLoading || isSearching}
            units={units}
            position={position}
            leafletMap={leafletMap}
          />
        )}
      </div>
      {t("UNIT.TMP_MESSAGE").length > 0 && (
        <div
          className="unit-browser__tmp_msg" // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("UNIT.TMP_MESSAGE"),
          }}
        />
      )}
    </div>
  );
}

export default UnitBrowser;
