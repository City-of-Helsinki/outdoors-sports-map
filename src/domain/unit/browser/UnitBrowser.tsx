import values from "lodash/values";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

import Page from "../../../common/a11y/Page";
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

type Props = {
  leafletMap?: RefObject<L.Map | null>;
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowser({ onViewChange, leafletMap }: Props) {
  const { t } = useTranslation();
  const doSearch = useDoSearch();
  const { sport, status } = useAppSearch();
  const isLoading = useSelector<AppState, boolean>(fromHome.getIsLoading);
  const address = useSelector<AppState, Address | undefined | null>(
    fromMap.getAddress
  );

  return (
    <Page
      title={t("APP.NAME")}
      description={t("APP.DESCRIPTION")}
      className="unit-browser"
    >
      <div className="unit-browser__fixed">
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
