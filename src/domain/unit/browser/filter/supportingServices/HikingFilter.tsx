import get from "lodash/get";
import invert from "lodash/invert";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";

import { UnitFilters } from "../../../unitConstants";
import UnitFilterButton from "../UnitBrowserFilterButton";
import UnitFilterLabelButton from "../UnitBrowserFilterLabelButton";
import UnitFilterOptionsWrapper from "../UnitBrowserFilterOptionsWrapper";

type UnitFilterProps = {
  name: string;
  active: string;
  options: Array<string>;
  secondaryOptions?: Array<string> | null | undefined;
  isHiking?: boolean;
};
type UnitFiltersProps = {
  filters: Array<UnitFilterProps>;
  t: () => string;
  updateFilter: (filter: string, value: string) => void;
  handleHikingSelect: (isSelected: boolean) => void;
  isSelected: boolean;
};
type FilterOptionsRowProps = {
  t: (arg0: string) => string;
  className: string;
  filterName: string;
  options: string[];
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  onSelect: (filterName: string, option: string) => void;
};

function FilterOptionsRow({
  t,
  className,
  filterName,
  options,
  onKeyDown,
  onSelect,
}: FilterOptionsRowProps) {
  return (
    <Row className={`${className} filter-options-row`}>
      {options.map((option) => (
        <Col className="unit-filters__option" xs={6} key={option}>
          <UnitFilterButton
            filterName={option}
            onKeyDown={onKeyDown}
            onClick={() => onSelect(filterName, option)}
            message={t(`UNIT_DETAILS.FILTER.${invert(UnitFilters)[option]}`)}
          />
        </Col>
      ))}
    </Row>
  );
}

type FilterOptionProps = {
  t: (arg0: string) => string;
  isActive: boolean;
  onAction: (filter: Record<string, any>) => void;
  onSelect: (filterName: string, option: string) => void;
  filter: UnitFilterProps;
};

function FilterOption({
  t,
  filter,
  isActive,
  onAction,
  onSelect,
}: FilterOptionProps) {
  const controlId = `control-${filter.name}`;
  const menuId = `menu-${filter.name}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const element = document.getElementById(controlId);

    if (e.key === "Enter" && element) {
      element.focus();
    }
  };

  const handleSelect = (filterName: string, option: string) => {
    onSelect(filterName, option);
  };

  return (
    <div>
      <UnitFilterLabelButton
        filter={filter}
        onAction={onAction}
        isActive={isActive}
        aria-haspopup="true"
        aria-controls={menuId}
        id={controlId}
      />
      {isActive && (
        <UnitFilterOptionsWrapper
          id={menuId}
          className="unit-filters__options-wrapper"
          tabIndex={-1}
          role="region"
          aria-labelledby={controlId}
        >
          <FilterOptionsRow
            filterName={filter.name}
            className="unit-filters__options"
            options={filter.options}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            t={t}
          />
        </UnitFilterOptionsWrapper>
      )}
    </div>
  );
}

const filterEquals = (a: any, b: any) => {
  // Checks if a and b are the same by comparing their names.
  if (a && b) {
    return get(a, "name") === get(b, "name");
  }

  return false;
};

type State = {
  expandedFilter: {} | null;
};

export class HikingFilter extends React.Component<
  UnitFiltersProps,
  State
> {
  constructor(props: UnitFiltersProps) {
    super(props);
    this.state = {
      expandedFilter: null,
    };
  }

  onMenuSelect = (key: string, value: string): void => {
    const {handleHikingSelect, isSelected } = this.props;
    this.setState({
      expandedFilter: null,
    });
    handleHikingSelect(!isSelected);
  };

  toggleExpandedFilter = (filter: Record<string, any>) => {
    const { expandedFilter } = this.state;
    const isFilterActive = filterEquals(filter, expandedFilter);

    this.setState({
      expandedFilter: isFilterActive ? null : filter,
    });
  };

  render() {
    const { filters, t } = this.props;
    const { expandedFilter } = this.state;  
    return (
      <div className="unit-filters">
        <Container className="unit-filters__filters">
          <Row className="unit-filters__filters">
            {filters.map((filter) => (
              <Col className="unit-filters__edit" xs={6} key={filter.name}>
                <FilterOption
                  filter={filter}
                  onAction={this.toggleExpandedFilter}
                  onSelect={this.onMenuSelect}
                  isActive={filterEquals(filter, expandedFilter)}
                  t={t}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }
}

export default withTranslation()(HikingFilter);
