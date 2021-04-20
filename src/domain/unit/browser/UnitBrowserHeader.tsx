import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import SMIcon from "../../../common/components/SMIcon";
import useDoSearch from "../../../common/hooks/useDoSearch";
import useSearch from "../../../common/hooks/useSearch";
import { AppState } from "../../app/appConstants";
import addressIcon from "../../assets/markers/unknown-satisfactory-off.png";
import { setLocation } from "../../map/state/actions";
import SearchContainer from "../../search/SearchContainer";
import * as unitSearchActions from "../state/search/actions";
import * as unitSearchSelectors from "../state/search/selectors";
import * as unitSelectors from "../state/selectors";
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
  const unitResults = unitSearchSelectors.getUnitSuggestions(state);
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
  collapse: () => void;
  expand: () => void;
  isExpanded: boolean;
  onViewChange: (coordinates: [number, number]) => void;
};

type Search = {
  s?: string;
};

function UnitBrowserHeader({
  expand,
  collapse,
  onViewChange,
  isExpanded,
}: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { search: searchString } = useLocation();
  const { s } = useSearch<Search>();
  const doSearch = useDoSearch();
  const suggestions = useSelector(
    suggestionsSelectorFactory(searchString, i18n.languages[0])
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
    (input: string, params: Record<string, any> = {}) => {
      doSearch("s", input);
      dispatch(unitSearchActions.searchUnits(input, params));
      expand();
    },
    [expand, doSearch, dispatch]
  );

  const handleOnClear = useCallback(() => {
    doSearch("s");
    dispatch(unitSearchActions.clearSearch());
  }, [dispatch, doSearch]);

  return (
    <div className="header">
      <SearchContainer
        search={s}
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
          action={collapse}
          icon="map-options"
          isActive={!isExpanded}
          name={t("UNIT.MAP_BUTTON")}
        />
        <ActionButton
          action={expand}
          icon="browse"
          isActive={isExpanded}
          name={t("UNIT.LIST_BUTTON")}
        />
      </div>
    </div>
  );
}

export default UnitBrowserHeader;
