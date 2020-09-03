// @flow

/*
   eslint-disable
   react/destructuring-assignment,
   react/prop-types,
   react/state-in-constructor,
   react/static-property-placement,
*/

import React from 'react';
import { translate } from 'react-i18next';
import { Grid, Row, Col } from 'react-bootstrap';
import get from 'lodash/get';
import UnitFilterButton from './UnitFilterButton';
import UnitFilterLabelButton from './UnitFilterLabelButton';

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

const FilterOptionsRow = ({
  t, className, filterName, options, onSelect,
}) => (
  <Row className={`${className} filter-options-row`}>
    {options.map((option) => (
      <Col className="unit-filters__option" xs={6} key={option}>
        <UnitFilterButton
          t={t}
          filterName={option}
          onClick={() => onSelect(filterName, option)}
        />
      </Col>
    ))}
  </Row>
);

const filterEquals = (a, b) => {
  // Checks if a and b are the same by comparing their names.
  if (a && b) {
    return get(a, 'name') === get(b, 'name');
  }
  return false;
};

export class UnitFiltersComponent extends React.Component {
  props: UnitFiltersProps;

  state: {
    expandedFilter: {} | null
  };

  state = {
    expandedFilter: null,
  }

  onMenuSelect = (key: string, value: string): void => {
    this.setState({ expandedFilter: null });
    this.props.updateFilter(key, value);
  }

  toggleExpandedFilter = (filter) => {
    const isFilterActive = filterEquals(filter, this.state.expandedFilter);
    this.setState({ expandedFilter: isFilterActive ? null : filter });
  }

  render() {
    const { filters, t } = this.props;
    const { expandedFilter } = this.state;

    // FIXME
    // There is really no reason to create this component on every render,
    // this should be separated to its own component outside render.
    const FilterOptions = ({ filter }: {filter: UnitFilterProps}) => (
      <Grid className="unit-filters__options">
        <FilterOptionsRow filterName={filter.name} className="unit-filters__options" options={filter.options} onSelect={this.onMenuSelect} t={t} />
        {filter.secondaryOptions && <Row componentClass="hr" className="unit-filters__options-separator" />}
        {filter.secondaryOptions
          && (
          <FilterOptionsRow
            className="unit-filters__options secondary"
            filterName={filter.name}
            options={filter.secondaryOptions}
            onSelect={this.onMenuSelect}
            t={t}
          />
          )}
      </Grid>
    );

    return (
      <div className="unit-filters">
        <Grid className="unit-filters__filters">
          <Row className="unit-filters__filters">
            {filters.map((filter) => (
              <Col className="unit-filters__edit" xs={6} key={filter.name}>
                <UnitFilterLabelButton
                  filter={filter}
                  onAction={this.toggleExpandedFilter}
                  isActive={filterEquals(filter, expandedFilter)}
                />
              </Col>
            ))}
          </Row>
        </Grid>
        {expandedFilter && <FilterOptions filter={expandedFilter} />}
      </div>
    );
  }
}

export default translate()(UnitFiltersComponent);
