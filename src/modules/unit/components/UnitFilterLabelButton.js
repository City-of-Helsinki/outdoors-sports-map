/*
   eslint-disable
   react/prop-types,
*/

import React from 'react';
import { withNamespaces } from 'react-i18next';

import UnitFilterButton from './UnitFilterButton';
import UnitFilterLabel from './UnitFilterLabel';

const UnitFilterLabelButton = ({
  filter, onAction, isActive, t,
}) => (
  <div>
    <UnitFilterLabel filterName={filter.name} />
    <UnitFilterButton
      t={t}
      filterName={filter.active}
      className={isActive ? 'active' : ''}
      onClick={() => onAction(filter)}
      showDropdownIndicator
    />
  </div>
);

export default withNamespaces()(UnitFilterLabelButton);
