import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import UnitFilterButton from './UnitFilterButton';
import UnitFilterLabel from './UnitFilterLabel';

const UnitFilterLabelButton = ({ filter, onAction, isActive }) => {
  const { t } = useTranslation();

  return (
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
};

UnitFilterLabelButton.propTypes = {
  filter: PropTypes.objectOf(PropTypes.any).isRequired,
  onAction: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default UnitFilterLabelButton;
