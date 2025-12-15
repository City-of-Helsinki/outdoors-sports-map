import { Button, ButtonSize, ButtonVariant, IconSearch } from "hds-react";
import { LocationDescriptor } from "history";
import { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import Link from "../../common/components/Link";
import UnitIcon from "../unit/UnitIcon";
import ObservationStatus from "../unit/UnitObservationStatus";
import { Unit } from "../unit/unitConstants";

export type Suggestion = {
  type: "searchable" | "loose";
  label: string;
  icon?: string;
  to?: LocationDescriptor;
  coordinates?: [number, number];
  unit?: Unit;
};

type Props = {
  openAllResults: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
  handleAddressClick: (coordinates: [number, number]) => void;
  suggestions: Suggestion[];
  menuPosition: { top: number };
  preventBlurClose: MutableRefObject<boolean>;
};

function SearchSuggestions({
  openAllResults,
  handleAddressClick,
  suggestions,
  menuPosition,
  preventBlurClose,
}: Props) {
  const { t } = useTranslation();

  const suggestionCount = suggestions.length;
  const searchableSuggestionCount = suggestions.filter(
    ({ type }) => type === "searchable",
  ).length;

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
    <div
      className="search-suggestions"
      data-testid="search-suggestions"
      style={{
        position: "fixed",
        top: `${menuPosition.top}px`,
        zIndex: 799,
      }}
      onMouseDown={() => {
        preventBlurClose.current = true;
      }}
      onTouchStart={() => {
        preventBlurClose.current = true;
      }}
    >
      {suggestionCount > 0 ? (
        <div
          className="search-suggestions__list"
          data-testid="suggestions-list"
        >
          {searchableSuggestionCount > 0 && (
            <Button
              className="search-suggestions__open-all"
              type="button"
              onClick={openAllResults}
              variant={ButtonVariant.Supplementary}
              iconEnd={<IconSearch />}
              size={ButtonSize.Small}
            >
              {t("SEARCH.SHOW_ALL_RESULTS")}
            </Button>
          )}
          {suggestions.map(({ icon, label, to, coordinates, unit }) => (
            <Link
              key={label}
              to={to || "#"}
              onClick={(e) => {
                if (coordinates) {
                  e.preventDefault();
                  handleAddressClick(coordinates);
                }
              }}
              className="search-suggestions__result"
            >
              {unit && (
                <div className="search-suggestions__result-icon">
                  <UnitIcon unit={unit} />
                </div>
              )}
              {icon && (
                <div className="search-suggestions__result-icon">
                  <img src={icon} height="21px" alt="" />
                </div>
              )}
              <div className="search-suggestions__result-details">
                <div className="search-suggestions__result-details__name">
                  {label}
                </div>
                {unit && <ObservationStatus unit={unit} />}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SearchSuggestions;
