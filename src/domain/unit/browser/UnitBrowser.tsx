import values from "lodash/values";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

import useDoSearch from "../../../common/hooks/useDoSearch";
import { Address, AppState } from "../../app/appConstants";
import routerPaths from "../../app/appRoutes";
import * as fromHome from "../../app/appSelectors";
import useAppSearch from "../../app/useAppSearch";
import * as fromMap from "../../map/state/selectors";
import { StatusFilters } from "../unitConstants";
import {
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

type Props = {
  leafletMap?: RefObject<L.Map | null>;
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowser({ onViewChange, leafletMap }: Props) {
  const { t } = useTranslation();
  const [contentMaxHeight, setContentMaxHeight] = useState<number>();
  const doSearch = useDoSearch();
  const { sport, status } = useAppSearch();
  const isLoading = useSelector<AppState, boolean>(fromHome.getIsLoading);
  const address = useSelector<AppState, Address | undefined | null>(
    fromMap.getAddress
  );

  useOnResize(
    useCallback(() => {
      setContentMaxHeight(calculateMaxHeight());
    }, [])
  );

  return (
    <div className="unit-browser">
      <div id="always-visible" className="unit-browser__fixed">
        <UnitBrowserHeader onViewChange={onViewChange} />
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
      <Route
        path={routerPaths.unitBrowserSearch}
        render={() => {
          return (
            <div
              className="unit-browser__content"
              style={{
                maxHeight: contentMaxHeight || calculateMaxHeight(),
              }}
            >
              <UnitBrowserResultList leafletMap={leafletMap} />
            </div>
          );
        }}
      />
      {t("UNIT_DETAILS.TMP_MESSAGE").length > 0 && (
        <div
          className="unit-browser__tmp_msg" // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("UNIT_DETAILS.TMP_MESSAGE"),
          }}
        />
      )}
    </div>
  );
}

export default UnitBrowser;
