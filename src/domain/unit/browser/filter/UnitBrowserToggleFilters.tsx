import { ToggleButton } from "hds-react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";

import { UnitFilters } from "../../unitConstants";


const filterNameToLabel = (filterName: string) => {
  switch (filterName) {
    case UnitFilters.SKIING_FREESTYLE:
      return "UNIT_DETAILS.FILTER.SKIING_FREESTYLE";

    case UnitFilters.SKIING_TRADITIONAL:
      return "UNIT_DETAILS.FILTER.SKIING_TRADITIONAL";

    case UnitFilters.SKIING_DOG_SKIJORING_TRACK:
      return "UNIT_DETAILS.FILTER.SKIING_DOG_SKIJORING_TRACK";

    case UnitFilters.LEAN_TO:
      return "UNIT_DETAILS.FILTER.LEAN_TO";

    case UnitFilters.COOKING_FACILITY:
      return "UNIT_DETAILS.FILTER.COOKING_FACILITY";

    case UnitFilters.INFORMATION_POINT:
      return "UNIT_DETAILS.FILTER.INFORMATION_POINT";

    case UnitFilters.CAMPING:
      return "UNIT_DETAILS.FILTER.CAMPING";

    case UnitFilters.SKI_LODGE:
      return "UNIT_DETAILS.FILTER.SKI_LODGE";

    default:
      return "";
  }
};

type UnitFiltersProps = {
  activeFilters: string;
  filters: Array<string>;
  name: string;
  updateFilter: (filter: string, value: string) => void;
};

function UnitBrowserToggleFilters(props: UnitFiltersProps): JSX.Element {
  const { activeFilters, filters, name, updateFilter } = props;
  const { t } = useTranslation();
  const active = !!activeFilters.length ? activeFilters.split(',') : [];
  const onToggle = (filterName: string, wasChecked: boolean): void => {
    let newFilters = [...active].filter((f) => f !== filterName);
    if (!wasChecked) {
      newFilters.push(filterName);
    }
    const filtersToString = newFilters.join(',');
    return updateFilter(name, filtersToString);
  };

  return (
    <div className="unit-filters">
      <div className="unit-filters__filters toggle-filters">
        {filters.map((filter) => (
          <div className="unit-filter-toggle-button" key={filter}>
            <ToggleButton
              id={`id-${filter}`}
              label={t(filterNameToLabel(filter))}
              checked={activeFilters.includes(filter)}
              onChange={(e) => onToggle(filter, e)}
              theme={{
                '--toggle-button-color': '#254d7a',
                '--toggle-button-hover-color': '#1b3b5f',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default withTranslation()(UnitBrowserToggleFilters);
