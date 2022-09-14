import { pick } from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router";

import SMIcon from "../../../common/components/SMIcon";
import useDoSearch from "../../../common/hooks/useDoSearch";
import useLanguage from "../../../common/hooks/useLanguage";
import { AppState } from "../../app/appConstants";
import routerPaths from "../../app/appRoutes";
import useAppSearch from "../../app/useAppSearch";
import addressIcon from "../../assets/markers/unknown-satisfactory-off.png";
import { setLocation } from "../../map/state/actions";
import SearchContainer from "../../search/SearchContainer";
import * as unitSearchActions from "../state/search/actions";
import * as unitSearchSelectors from "../state/search/selectors";
import * as unitSelectors from "../state/selectors";
import { UNIT_BATCH_SIZE } from "../unitConstants";
import { getAttr } from "../unitHelpers";

type ActionButtonProps = {
  action: () => void;
  icon: string;
  isActive: boolean;
  name: string;
};

function ActionButton({ action, icon, isActive, name }: ActionButtonProps) {
  return (
    <button
      className="action-button"
      aria-pressed={isActive}
      onClick={action}
      type="button"
    >
      <SMIcon className="unit-browser__action" icon={icon} aria-label={name} />
    </button>
  );
}

const suggestionsSelectorFactory = (search: string, language: string) => (
  state: AppState
) => {
  const unitResults = unitSearchSelectors.getUnitSuggestions(state).filter(function(unit) {
    return unit !== undefined;
  });
  const addressesResults = unitSearchSelectors.getAddresses(state);
  const unitSuggestions = unitResults.map((unit) => ({
    type: "searchable" as const,
    label: getAttr(unit.name, language),
    unit,
    to: {
      pathname: `/unit/${unit.id}`,
      state: {
        search,
      },
    },
  }));
  const addressSuggestions = addressesResults.map((address) => ({
    type: "loose" as const,
    label: address.properties.label,
    icon: addressIcon,
    coordinates: address.geometry.coordinates.slice().reverse(),
  }));

  return [...unitSuggestions, ...addressSuggestions];
};

type Props = {
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowserHeader({ onViewChange }: Props) {
  const { t } = useTranslation();
  const language = useLanguage();
  const dispatch = useDispatch();
  const { search: searchString } = useLocation();
  const searchMatch = useRouteMatch(routerPaths.unitBrowserSearch);
  const history = useHistory();
  const { q, ...appSearch } = useAppSearch();
  const doSearch = useDoSearch();
  const suggestions = useSelector(
    suggestionsSelectorFactory(searchString, language)
  );
  const disabled = useSelector(unitSelectors.getIsLoading);
  const isActive = useSelector(unitSearchSelectors.getIsActive);

  const handleAddressClick = useCallback(
    (coordinates: [number, number]) => {
      dispatch(setLocation(coordinates));
      onViewChange(coordinates);
    },
    [dispatch, onViewChange]
  );

  const handleOnFindSuggestions = useCallback(
    (input: string) => {
      dispatch(unitSearchActions.fetchUnitSuggestions(input));
    },
    [dispatch]
  );

  const handleOnSearch = useCallback(
    (input: string) => {
      const nextSearch = {
        ...appSearch,
        q: input,
        maxUnitCount: UNIT_BATCH_SIZE.toString(),
      };

      // If the search page is not yet open, take the user there.
      if (!searchMatch) {
        const searchParams = new URLSearchParams(nextSearch);

        history.push(`/fi/search?${searchParams.toString()}`);
      } else {
        doSearch(nextSearch);
      }

      dispatch(
        unitSearchActions.searchUnits(
          input,
          pick(nextSearch, ["status", "sport"])
        )
      );
    },
    [doSearch, dispatch, history, searchMatch, appSearch]
  );

  const handleOnClear = useCallback(() => {
    doSearch("q");
    dispatch(unitSearchActions.clearSearch());
  }, [dispatch, doSearch]);

  return (
    <div className="header">
      <SearchContainer
        search={q}
        disabled={disabled}
        isActive={isActive}
        suggestions={suggestions}
        onFindSuggestions={handleOnFindSuggestions}
        onSearch={handleOnSearch}
        onClear={handleOnClear}
        onAddressClick={handleAddressClick}
      />
      <div className="action-buttons">
        <ActionButton
          action={() => {
            history.push(`/${language}${searchString}`);
          }}
          icon="map-options"
          isActive={searchMatch === null}
          name={t("UNIT_DETAILS.MAP_BUTTON")}
        />
        <ActionButton
          action={() => {
            history.push(`/${language}/search${searchString}`);
          }}
          icon="browse"
          isActive={searchMatch !== null}
          name={t("UNIT_DETAILS.LIST_BUTTON")}
        />
      </div>
    </div>
  );
}

export default UnitBrowserHeader;
