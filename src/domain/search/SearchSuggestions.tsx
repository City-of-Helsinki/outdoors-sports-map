import { LocationDescriptor } from "history";
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
  openAllResults: (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  handleAddressClick: (coordinates: [number, number]) => void;
  suggestions: Suggestion[];
};

function SearchSuggestions({
  openAllResults,
  handleAddressClick,
  suggestions,
}: Props) {
  const { t } = useTranslation();

  const suggestionCount = suggestions.length;
  const searchableSuggestionCount = suggestions.filter(
    ({ type }) => type === "searchable"
  ).length;

  return (
    <div className="search-suggestions">
      {suggestionCount > 0 ? (
        <div className="search-suggestions__list">
          {searchableSuggestionCount > 0 && ( // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              href=""
              className="search-suggestions__open-all"
              onClick={(e) => {
                e.preventDefault();
                openAllResults(e);
              }}
            >
              {t("SEARCH.SHOW_ALL_RESULTS")}
            </a>
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
