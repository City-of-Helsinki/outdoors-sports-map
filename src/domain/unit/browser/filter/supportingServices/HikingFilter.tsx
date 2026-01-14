import { useState, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  FilterOption,
  filterEquals,
  UnitFilterProps,
} from "../UnitBrowserFilter";

type UnitFiltersProps = {
  filters: Array<UnitFilterProps>;
  updateFilter: (filter: string, value: string) => void;
  handleHikingSelect: (isSelected: boolean) => void;
  isSelected: boolean;
};

function HikingFilter({
  filters,
  handleHikingSelect,
  isSelected,
}: Readonly<UnitFiltersProps>) {
  const [expandedFilter, setExpandedFilter] = useState<UnitFilterProps | null>(null);

  const onMenuSelect = useCallback(
    (): void => {
      setExpandedFilter(null);
      handleHikingSelect(!isSelected);
    },
    [handleHikingSelect, isSelected],
  );

  const toggleExpandedFilter = useCallback(
    (filter: UnitFilterProps) => {
      const isFilterActive = filterEquals(filter, expandedFilter);
      setExpandedFilter(isFilterActive ? null : filter);
    },
    [expandedFilter],
  );

  return (
    <div className="unit-filters rounded-bottom-corners">
      <Container className="unit-filters__filters">
        <Row className="unit-filters__filters">
          {filters.map((filter) => (
            <Col className="unit-filters__edit" xs={6} key={filter.name}>
              <FilterOption
                filter={filter}
                onToggle={() => toggleExpandedFilter(filter)}
                onSelect={onMenuSelect}
                isActive={filterEquals(filter, expandedFilter)}
                customActiveLogic={() => isSelected}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default HikingFilter;
