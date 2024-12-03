import L from "leaflet";
import values from "lodash/values";
import React, { RefObject, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import UnitBrowserResultListSort from "./UnitBrowserResultListSort";
import useUnitSearchResults from "./useUnitSearchResults";
import Link from "../../../../common/components/Link";
import Loading from "../../../../common/components/Loading";
import SMIcon from "../../../../common/components/SMIcon";
import useDoSearch from "../../../../common/hooks/useDoSearch";
import useLanguage from "../../../../common/hooks/useLanguage";
import * as PathUtils from "../../../../common/utils/pathUtils";
import useAppSearch from "../../../app/useAppSearch";
import UnitIcon from "../../UnitIcon";
import ObservationStatus from "../../UnitObservationStatus";
import { View } from "../../UnitView";
import { SortKeys, Unit, UNIT_BATCH_SIZE } from "../../unitConstants";
import * as unitHelpers from "../../unitHelpers";

type UnitListItemProps = {
  unit: Unit;
};

const UnitListItem = React.memo<UnitListItemProps>(
  ({ unit }) => {
    const language = useLanguage();
    const { pathname, search } = useLocation();
    const appSearch = useAppSearch();

    // @ts-ignore
    const unitNameInLanguage = unit.name[language];
    const unitPath = unitNameInLanguage
      ? `/unit/${unit.id}-${encodeURIComponent(
          encodeURIComponent(unitHelpers.getAttr(unit.name, language))
        )}`
      : `/unit/${unit.id}`;

    return (
      <Link
        to={{
          pathname: unitPath,
          state: {
            previous: `${PathUtils.removeLanguageFromPathname(
              pathname
            )}${search}`,
            search: appSearch,
          },
        }}
        className="list-view-item"
      >
        <div className="list-view-item__unit-marker">
          <UnitIcon unit={unit} />
        </div>
        <div className="list-view-item__unit-details">
          <div className="list-view-item__unit-name">
            {unitHelpers.getAttr(unit.name, language)}
          </div>
          <ObservationStatus unit={unit} />
        </div>
        <div className="list-view-item__unit-open">
          <SMIcon icon="forward" />
        </div>
      </Link>
    );
  },
  ({ unit }, { unit: nextUnit }) => {
    return JSON.stringify(nextUnit) !== JSON.stringify(unit);
  }
);

type Props = {
  leafletMap?: RefObject<L.Map | null>;
};

function UnitBrowserResultList({ leafletMap }: Props) {
  const { t } = useTranslation();
  const { sortKey, maxUnitCount } = useAppSearch();
  const doSearch = useDoSearch();

  const { totalUnits, results } = useUnitSearchResults({
    sortKey,
    maxUnitCount: Number(maxUnitCount),
    leafletMap,
  });

  const totalUnitResults = sortKey === "favorites" ? results?.length : totalUnits;

  const handleOnSortKeySelect = useCallback(
    (nextSortKey) => {
      if (nextSortKey) {
        doSearch({
          sortKey: nextSortKey,
          maxUnitCount: UNIT_BATCH_SIZE.toString(),
        });
      }
    },
    [doSearch]
  );

  const handleLoadMoreClick = useCallback(
    (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      doSearch(
        "maxUnitCount",
        (Number(maxUnitCount) + UNIT_BATCH_SIZE).toString()
      );
    },
    [maxUnitCount, doSearch]
  );

  return (
    <View id="list-view" className="list-view">
      <div className="list-view__container">
        <div className="list-view__block">
          <UnitBrowserResultListSort
            values={values(SortKeys)}
            active={sortKey}
            onSelect={handleOnSortKeySelect}
          />
        </div>
        <div className="list-view__block">
          {results === null && <Loading />}
          {Array.isArray(results) && (
          <>
            {results.length === 0 && sortKey === 'favorites' ? (
              <p style={{ textAlign: "center" }}>{t("UNIT_DETAILS.NO_FAVORITES")}</p>
            ) : (
              <>
                {results.map((unit) => (
                  <UnitListItem key={unit.id} unit={unit} />
                ))}
                {results.length !== totalUnitResults && ( // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a
                    style={{
                      display: "block",
                      textAlign: "center",
                      cursor: "pointer",
                      margin: "18px auto 10px",
                    }}
                    href=""
                    onClick={handleLoadMoreClick}
                  >
                    {t("UNIT_DETAILS.SHOW_MORE")}
                  </a>
                )}
              </>
            )}
          </>
          )}
        </div>
      </div>
    </View>
  );
}

export default UnitBrowserResultList;
