import { IconMap, IconMenuHamburger } from "hds-react";
import { pick } from "lodash";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router";

import useDoSearch from "../../../common/hooks/useDoSearch";
import useLanguage from "../../../common/hooks/useLanguage";
import routerPaths from "../../app/appRoutes";
import useAppSearch from "../../app/useAppSearch";
import addressIcon from "../../assets/markers/unknown-satisfactory-off.png";
import { setLocation, useLazyGetAddressQuery } from "../../map/mapSlice";
import SearchContainer from "../../search/SearchContainer";
import * as unitSearchActions from "../state/search/actions";
import * as unitSearchSelectors from "../state/search/selectors";
import { selectIsUnitLoading } from "../state/selectors";
import { UNIT_BATCH_SIZE } from "../unitConstants";
import { getAttr } from "../unitHelpers";

type ActionButtonProps = {
  action: () => void;
  icon: React.ReactNode;
  isActive: boolean;
  name: string;
};

function ActionButton({ action, icon, isActive, name }: ActionButtonProps) {
  return (
    <button
      className="action-button"
      aria-label={name}
      aria-pressed={isActive}
      onClick={action}
      type="button"
    >
      {icon}
    </button>
  );
}

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
  
  const unitResults = useSelector(unitSearchSelectors.getUnitSuggestions);
  const addressesResults = useSelector(unitSearchSelectors.getAddresses);
  const disabled = useSelector(selectIsUnitLoading);
  const isActive = useSelector(unitSearchSelectors.getIsActive);
  const [triggerGetAddress] = useLazyGetAddressQuery();

  // Memoize suggestions to avoid creating new arrays on every render
  const suggestions = useMemo(() => {
    const filteredUnits = unitResults.filter(unit => unit !== undefined);
    const unitSuggestions = filteredUnits.map((unit) => ({
      type: "searchable" as const,
      label: getAttr(unit.name, language),
      unit,
      to: {
        pathname: `/unit/${unit.id}`,
        state: {
          search: searchString,
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
  }, [unitResults, addressesResults, language, searchString]);

  const handleAddressClick = useCallback(
    (coordinates: [number, number]) => {
      dispatch(setLocation(coordinates));
      triggerGetAddress({ lat: coordinates[0], lon: coordinates[1] });
      onViewChange(coordinates);
    },
    [dispatch, triggerGetAddress, onViewChange],
  );

  const handleOnFindSuggestions = useCallback(
    (input: string) => {
      dispatch(unitSearchActions.fetchUnitSuggestions(input));
    },
    [dispatch],
  );

  const handleOnSearch = useCallback(
    (input: string) => {
      const nextSearch = {
        ...appSearch,
        q: input,
        maxUnitCount: UNIT_BATCH_SIZE.toString(),
      };

      // If we are already in search view, just update the search params
      // Otherwise, navigate to search view with the params
      if (searchMatch) {
        doSearch(nextSearch);
      } else {
        const searchParams = new URLSearchParams(nextSearch);

        history.push(`/fi/search?${searchParams.toString()}`);
        
      }

      dispatch(
        unitSearchActions.searchUnits(
          input,
          pick(nextSearch, ["status", "sport"]),
        ),
      );
    },
    [doSearch, dispatch, history, searchMatch, appSearch],
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
          icon={<IconMap aria-hidden={true} />}
          isActive={searchMatch === null}
          name={t("UNIT_DETAILS.MAP_BUTTON")}
        />
        <ActionButton
          action={() => {
            history.push(`/${language}/search${searchString}`);
          }}
          icon={<IconMenuHamburger aria-hidden={true} />}
          isActive={searchMatch !== null}
          name={t("UNIT_DETAILS.LIST_BUTTON")}
        />
      </div>
    </div>
  );
}

export default UnitBrowserHeader;
