import values from "lodash/values";
import { useCallback, useState } from "react";

import UnitBrowserAddressBar from "./UnitBrowserAddressBar";
import UnitBrowserFilters from "./filter/UnitBrowserFilter";
import UnitBrowserToggleFilters from "./filter/UnitBrowserToggleFilters";
import HikingFilter from "./filter/supportingServices/HikingFilter";
import useDoSearch from "../../../common/hooks/useDoSearch";
import { Address } from "../../app/appConstants";
import useAppSearch from "../../app/useAppSearch";
import { StatusFilters, UnitFilters } from "../unitConstants";
import {
  getOnSeasonSportFilters,
  getSportSpecificationFilters,
} from "../unitHelpers";

type Props = {
  address: Address | undefined | null;
  onViewChange: (coordinates: [number, number]) => void;
};

function UnitBrowserFilterSection({ address, onViewChange }: Props) {
  const doSearch = useDoSearch();
  const { sport, status, sportSpecification } = useAppSearch();
  const [isHikingSelected, setIsHikingSelected] = useState<boolean>(false);

  const handleHikingSelect = useCallback((isSelected: boolean) => {
    setIsHikingSelected(isSelected);
  }, []);

  const mainFilters = [
    {
      name: "sport",
      active: sport,
      options: getOnSeasonSportFilters(),
    },
    {
      name: "status",
      active: status,
      options: values(StatusFilters),
    },
  ];

  const hikingFilters = [
    {
      name: "hiking",
      active: UnitFilters.HIKING,
      options: [UnitFilters.HIKING],
      isHiking: true,
    },
  ];

  const hasSkiingSubFilters = sport === UnitFilters.SKIING;
  const hasAddress = address && Object.keys(address).length !== 0;

  return (
    <>
      <div className="unit-browser__fixed">
        <UnitBrowserFilters filters={mainFilters} updateFilter={doSearch} />

        {hasSkiingSubFilters && (
          <UnitBrowserToggleFilters
            name="sportSpecification"
            filters={getSportSpecificationFilters(sport)}
            updateFilter={doSearch}
            activeFilters={sportSpecification}
          />
        )}
      </div>

      <div className="unit-browser__fixed">
        <HikingFilter
          filters={hikingFilters}
          updateFilter={doSearch}
          handleHikingSelect={handleHikingSelect}
          isSelected={isHikingSelected}
        />

        {isHikingSelected && (
          <UnitBrowserToggleFilters
            name="sportSpecification"
            filters={getSportSpecificationFilters(UnitFilters.HIKING)}
            updateFilter={doSearch}
            activeFilters={sportSpecification}
          />
        )}

        {hasAddress && (
          <UnitBrowserAddressBar handleClick={onViewChange} address={address} />
        )}
      </div>
    </>
  );
}

export default UnitBrowserFilterSection;
