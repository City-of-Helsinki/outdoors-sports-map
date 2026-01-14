import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

import UnitBrowserFilterSection from "./UnitBrowserFilterSection";
import UnitBrowserHeader from "./UnitBrowserHeader";
import UnitBrowserResultList from "./resultList/UnitBrowserResultList";
import Page from "../../../common/a11y/Page";
import { Address, AppState } from "../../app/appConstants";
import routerPaths from "../../app/appRoutes";
import { selectIsLoading } from "../../app/state/appSelectors";
import { selectAddress } from "../../map/state/mapSlice";

type Props = {
  leafletMap?: RefObject<L.Map | null>;
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowser({ onViewChange, leafletMap }: Props) {
  const { t } = useTranslation();
  const isLoading = useSelector<AppState, boolean>(selectIsLoading);
  const address = useSelector<AppState, Address | undefined | null>(
    selectAddress,
  );

  const hasTmpMessage = t("UNIT_DETAILS.TMP_MESSAGE").length > 0;

  return (
    <Page
      title={t("APP.NAME")}
      description={t("APP.DESCRIPTION")}
      className="unit-browser"
    >
      <div className="unit-browser__fixed">
        <UnitBrowserHeader onViewChange={onViewChange} />
      </div>

      {!isLoading && (
        <UnitBrowserFilterSection
          address={address}
          onViewChange={onViewChange}
        />
      )}

      <Route
        path={routerPaths.unitBrowserSearch}
        render={() => <UnitBrowserResultList leafletMap={leafletMap} />}
      />

      {hasTmpMessage && (
        <div
          className="unit-browser__tmp_msg"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("UNIT_DETAILS.TMP_MESSAGE"),
          }}
        />
      )}
    </Page>
  );
}

export default UnitBrowser;
