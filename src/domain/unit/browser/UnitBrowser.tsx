import values from "lodash/values";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

import UnitBrowserAddressBar from "./UnitBrowserAddressBar";
import UnitBrowserHeader from "./UnitBrowserHeader";
import UnitBrowserFilters from "./filter/UnitBrowserFilter";
import UnitBrowserToggleFilters from "./filter/UnitBrowserToggleFilters";
import HikingFilter from './filter/supportingServices/HikingFilter';
import UnitBrowserResultList from "./resultList/UnitBrowserResultList";
import Page from "../../../common/a11y/Page";
import useDoSearch from "../../../common/hooks/useDoSearch";
import { Address, AppState } from "../../app/appConstants";
import routerPaths from "../../app/appRoutes";
import * as fromHome from "../../app/appSelectors";
import useAppSearch from "../../app/useAppSearch";
import * as fromMap from "../../map/state/selectors";
import { StatusFilters, UnitFilters } from "../unitConstants";
import {
  getOnSeasonSportFilters,
  getSportSpecificationFilters,
} from "../unitHelpers";

type Props = {
  leafletMap?: RefObject<L.Map | null>;
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowser({ onViewChange, leafletMap }: Props) {
  const { t } = useTranslation();
  const doSearch = useDoSearch();
  const { sport, status, sportSpecification } = useAppSearch();
  const isLoading = useSelector<AppState, boolean>(fromHome.getIsLoading);
  const address = useSelector<AppState, Address | undefined | null>(
    fromMap.getAddress
  );
  const hasSubFilters = sport === UnitFilters.SKIING;
  const [ishikingSelected, setIsHikingSelected] = useState<boolean>(false);

  const handleHikingSelect = useCallback(
    (isSelected: boolean)=>{
      setIsHikingSelected(isSelected);
    },[])

  return (
    <Page
      title={t("APP.NAME")}
      description={t("APP.DESCRIPTION")}
      className="unit-browser"
    >
      <div className="unit-browser__fixed">
        <UnitBrowserHeader onViewChange={onViewChange} />
        {!isLoading && (<>
          <UnitBrowserFilters
            filters={[
              {
                name: "sport",
                active: sport,
                options: getOnSeasonSportFilters(),
              },
              {
                name: "status",
                active: status,
                options: values(StatusFilters),
              },
            ]}
            updateFilter={doSearch}
          />
          {hasSubFilters && (
            <UnitBrowserToggleFilters
              name="sportSpecification"
              filters={getSportSpecificationFilters(sport)}
              updateFilter={doSearch}
              activeFilters={sportSpecification}
            />
          )}
        </>)}
      </div>
      <div className="unit-browser__fixed">
      {!isLoading && (<>
          <HikingFilter
            filters={[
              {
                name: "sport",
                active: UnitFilters.HIKING,
                options: [UnitFilters.HIKING],
                isHiking: true,
              }
            ]}
            updateFilter={doSearch}
            handleHikingSelect={handleHikingSelect}
            isSelected={ishikingSelected}
          />
          {ishikingSelected && (
            <UnitBrowserToggleFilters
              name="sportSpecification"
              filters={getSportSpecificationFilters(UnitFilters.HIKING)}
              updateFilter={doSearch}
              activeFilters={sportSpecification}
            />
          )}
        </>)}
        {!isLoading && address && Object.keys(address).length !== 0 && (
          <UnitBrowserAddressBar handleClick={onViewChange} address={address} />
        )}
      </div>
      <Route
        path={routerPaths.unitBrowserSearch}
        render={() => {
          return <UnitBrowserResultList leafletMap={leafletMap} />;
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
    </Page>
  );
}

export default UnitBrowser;
