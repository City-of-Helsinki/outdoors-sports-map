// @flow
import React from 'react';
import { Button } from 'react-bootstrap';

import UnitFilterIcon from './UnitFilterIcon';
import DropdownIndicator from './DropdownIndicator';

type Props = {
  filterName: string,
  className?: string,
  message: string,
  showDropdownIndicator?: boolean,
};

const UnitFilterButton = ({
  filterName,
  className = '',
  showDropdownIndicator = false,
  message,
  ...rest
}: Props) => (
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
