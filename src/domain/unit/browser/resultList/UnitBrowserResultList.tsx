import { Button, ButtonVariant, IconArrowRight } from "hds-react";
import L from "leaflet";
import values from "lodash/values";
import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import UnitBrowserResultListSort from "./UnitBrowserResultListSort";
import useUnitSearchResults from "./useUnitSearchResults";
import Link from "../../../../common/components/Link";
import Loading from "../../../../common/components/Loading";
import useDoSearch from "../../../../common/hooks/useDoSearch";
import useLanguage from "../../../../common/hooks/useLanguage";
import * as PathUtils from "../../../../common/utils/pathUtils";
import useAppSearch from "../../../app/useAppSearch";
import UnitIcon from "../../UnitIcon";
import ObservationStatus from "../../UnitObservationStatus";
import { View } from "../../UnitView";
import { Unit } from "../../types";
import { SortKeys, UNIT_BATCH_SIZE } from "../../unitConstants";
import * as unitHelpers from "../../unitHelpers";

type UnitListItemProps = {
  unit: Unit;
};

const UnitListItem = React.memo<UnitListItemProps>(
  ({ unit }) => {
    const language = useLanguage();
    const { pathname, search } = useLocation();
    const appSearch = useAppSearch();

    const unitName = unitHelpers.getAttr(unit.name, language);
    const unitPath = unitName
      ? `/unit/${unit.id}-${encodeURIComponent(unitName)}`
      : `/unit/${unit.id}`;

    return (
      <Link
        to={{
          pathname: unitPath,
          state: {
            previous: `${PathUtils.removeLanguageFromPathname(
              pathname,
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
          <div className="list-view-item__unit-name">{unitName}</div>
          <ObservationStatus unit={unit} />
        </div>
        <div className="list-view-item__unit-open">
          <IconArrowRight aria-hidden="true" />
        </div>
      </Link>
    );
  },
  ({ unit }, { unit: nextUnit }) => {
    return JSON.stringify(nextUnit) !== JSON.stringify(unit);
  },
);

type Props = {
  leafletMap?: RefObject<L.Map | null>;
};

function UnitBrowserResultList({ leafletMap }: Props) {
  const { t } = useTranslation();
  const { q, sortKey, maxUnitCount } = useAppSearch();
  const doSearch = useDoSearch();

  const { totalUnits, results } = useUnitSearchResults({
    sortKey,
    maxUnitCount: Number(maxUnitCount),
    leafletMap,
  });

  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevResultsNullRef = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const firstNewItemIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const wasLoading = prevResultsNullRef.current;
    prevResultsNullRef.current = results === null;

    if (
      firstNewItemIndexRef.current !== null &&
      Array.isArray(results) &&
      results.length > firstNewItemIndexRef.current
    ) {
      const index = firstNewItemIndexRef.current;
      firstNewItemIndexRef.current = null;

      const items =
        listRef.current?.querySelectorAll<HTMLElement>(".list-view-item");
      const firstNewItem = items?.[index];
      firstNewItem?.scrollIntoView({ block: "start", behavior: "smooth" });
      firstNewItem?.focus({ preventScroll: true });

      if (announcementRef.current) {
        announcementRef.current.textContent = t("UNIT_DETAILS.RESULTS_LOADED", {
          shown: results.length,
          total: totalUnits,
        });
      }
    } else if (wasLoading && results !== null && q) {
      headingRef.current?.focus();
    }
  }, [results, q, totalUnits, t]);

  const handleOnSortKeySelect = useCallback(
    (nextSortKey: string | null) => {
      if (nextSortKey) {
        doSearch({
          sortKey: nextSortKey,
          maxUnitCount: UNIT_BATCH_SIZE.toString(),
        });
      }
    },
    [doSearch],
  );

  const handleLoadMoreClick = useCallback(
    (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();

      firstNewItemIndexRef.current = results?.length ?? 0;

      doSearch(
        "maxUnitCount",
        (Number(maxUnitCount) + UNIT_BATCH_SIZE).toString(),
      );
    },
    [maxUnitCount, doSearch, results],
  );

  return (
    <View id="list-view" className="list-view">
      <div className="list-view__container">
        <h2
          ref={headingRef}
          className="list-view__results-heading"
          tabIndex={-1}
        >
          {t("APP.SEARCH_RESULTS_PANEL")}
        </h2>
        <div className="list-view__block">
          <UnitBrowserResultListSort
            values={values(SortKeys)}
            active={sortKey}
            onSelect={handleOnSortKeySelect}
          />
        </div>
        <div ref={announcementRef} aria-live="polite" aria-atomic="true" className="sr-only" />
        <div ref={listRef} className="list-view__items-block">
          {results === null && <Loading />}
          {Array.isArray(results) && (
            <>
              {results.length === 0 ? (
                <p style={{ textAlign: "center" }}>
                  {sortKey === "favorites"
                    ? t("UNIT_DETAILS.NO_FAVORITES")
                    : t("UNIT_DETAILS.NO_RESULTS")}
                </p>
              ) : (
                <>
                  <output className="list-view__results-count">
                    {t("UNIT_DETAILS.RESULT_COUNT", { count: totalUnits })}
                  </output>
                  {results.map((unit) => (
                    <UnitListItem key={unit.id} unit={unit} />
                  ))}
                  {sortKey !== "favorites" && results.length < totalUnits && (
                    <Button
                      className="list-view__show-more-button"
                      onClick={handleLoadMoreClick}
                      variant={ButtonVariant.Secondary}
                    >
                      {t("UNIT_DETAILS.SHOW_MORE")}
                    </Button>
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
