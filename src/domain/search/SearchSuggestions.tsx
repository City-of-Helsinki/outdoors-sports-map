import { Button, ButtonSize, ButtonVariant, IconSearch } from "hds-react";
import { LocationDescriptor } from "history";
import { MutableRefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Link from "../../common/components/Link";
import UnitIcon from "../unit/UnitIcon";
import ObservationStatus from "../unit/UnitObservationStatus";
import { Unit } from "../unit/types";

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
  preventBlurCloseRef: MutableRefObject<boolean>;
  activeIndex: number;
};

function SearchSuggestions({
  openAllResults,
  handleAddressClick,
  suggestions,
  menuPosition,
  preventBlurCloseRef,
  activeIndex,
}: Props) {
  const { t } = useTranslation();
  const listboxRef = useRef<HTMLUListElement>(null);

  const suggestionCount = suggestions.length;
  const searchableSuggestionCount = suggestions.filter(
    ({ type }) => type === "searchable",
  ).length;

  useEffect(() => {
  if (activeIndex < 0 || activeIndex >= suggestions.length) {
    return;
  }

  const activeOption = listboxRef.current?.querySelector<HTMLElement>(
    `#search-suggestion-${activeIndex}`,
  );
  activeOption?.scrollIntoView({ block: "nearest" });
}, [activeIndex, suggestions.length]);

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
        preventBlurCloseRef.current = true;
      }}
      onTouchStart={() => {
        preventBlurCloseRef.current = true;
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
              tabIndex={-1}
            >
              {t("SEARCH.SHOW_ALL_RESULTS")}
            </Button>
          )}
          <ul ref={listboxRef} role="listbox" id="search-suggestions-listbox" className="search-suggestions__options">
            {suggestions.map(({ icon, label, to, coordinates, unit }, index) => (
              <li
                key={label}
                role="option"
                id={`search-suggestion-${index}`}
                aria-selected={index === activeIndex}
              >
                <Link
                  to={to || "#"}
                  onClick={(e) => {
                    if (coordinates) {
                      e.preventDefault();
                      handleAddressClick(coordinates);
                    }
                  }}
                  className="search-suggestions__result"
                  tabIndex={-1}
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
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default SearchSuggestions;
