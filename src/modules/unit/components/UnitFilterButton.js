// @flow
import React from 'react';
import { Button } from 'react-bootstrap';
import UnitFilterIcon from './UnitFilterIcon';
import DropdownIndicator from './DropdownIndicator';

const UnitFilterButton = ({
  filterName,
  className,
  // eslint-disable-next-line react/prop-types
  showDropdownIndicator = false,
  message,
  ...rest
}: {
  filterName: string,
  className: string,
  message: string,
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Button className={`unit-filter-button ${className}`} {...rest}>
    <UnitFilterIcon
      className="unit-filter-button__icon"
      filter={filterName}
      aria-hidden="true"
    />
    <span className="unit-filter-button__name">{message}</span>
    {showDropdownIndicator && <DropdownIndicator />}
  </Button>
);

export default UnitFilterButton;
