// @flow

import React from 'react';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import get from 'lodash/get';
import invert from 'lodash/invert';

import { UnitFilters } from '../constants';
import UnitFilterButton from './UnitFilterButton';
import UnitFilterLabelButton from './UnitFilterLabelButton';
import UnitFilterOptionsWrapper from './UnitFilterOptionsWrapper';

type UnitFilterProps = {
  name: string,
  active: string,
  options: Array<string>,
  secondaryOptions: ?Array<string>,
};

type UnitFiltersProps = {
  filters: Array<UnitFilterProps>,
  t: () => string,
  updateFilter: (filter: string, value: string) => void,
};

type FilterOptionsRowProps = {
  t: (string) => string,
  className: string,
  filterName: string,
  options: string[],
  onKeyDown: () => void,
  onSelect: (filterName: string, option: string) => void,
};

const FilterOptionsRow = ({
  t,
  className,
  filterName,
  options,
  onKeyDown,
  onSelect,
}: FilterOptionsRowProps) => (
  <Row className={`${className} filter-options-row`}>
    {options.map((option) => (
      <Col className="unit-filters__option" xs={6} key={option}>
        <UnitFilterButton
          filterName={option}
          onKeyDown={onKeyDown}
          onClick={() => onSelect(filterName, option)}
          message={t(`UNIT.FILTER.${invert(UnitFilters)[option]}`)}
        />
      </Col>
    ))}
  </Row>
);

type FilterOptionProps = {
  t: (string) => string,
  filter: string,
  isActive: boolean,
  onAction: () => void,
  onSelect: () => void,
  filter: UnitFilterProps,
};

const FilterOption = ({
  t,
  filter,
  isActive,
  onAction,
  onSelect,
}: FilterOptionProps) => {
  const controlId = `control-${filter.name}`;
  const menuId = `menu-${filter.name}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.getElementById(controlId).focus();
    }
  };

  const handleSelect = (...args) => {
    onSelect(...args);
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
          tabIndex="-1"
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
          {filter.secondaryOptions && (
            <Row as="hr" className="unit-filters__options-separator" />
          )}
          {filter.secondaryOptions && (
            <FilterOptionsRow
              className="unit-filters__options secondary"
              filterName={filter.name}
              options={filter.secondaryOptions}
              onKeyDown={handleKeyDown}
              onSelect={handleSelect}
              t={t}
            />
          )}
        </UnitFilterOptionsWrapper>
      )}
    </div>
  );
};

const filterEquals = (a, b) => {
  // Checks if a and b are the same by comparing their names.
  if (a && b) {
    return get(a, 'name') === get(b, 'name');
  }
  return false;
};

type State = {
  expandedFilter: {} | null,
};

export class UnitFiltersComponent extends React.Component<
  void,
  UnitFiltersProps,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      expandedFilter: null,
    };
  }

  onMenuSelect = (key: string, value: string): void => {
    const { updateFilter } = this.props;

    this.setState({ expandedFilter: null });
    updateFilter(key, value);
  };

  toggleExpandedFilter = (filter) => {
    const { expandedFilter } = this.state;

    const isFilterActive = filterEquals(filter, expandedFilter);
    this.setState({ expandedFilter: isFilterActive ? null : filter });
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

export default withTranslation()(UnitFiltersComponent);
