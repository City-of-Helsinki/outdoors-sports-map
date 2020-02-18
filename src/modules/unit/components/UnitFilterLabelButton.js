import React from 'react';
import invert from 'lodash/invert';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { UnitFilters } from '../constants';
import UnitFilterButton from './UnitFilterButton';
import UnitFilterLabel from './UnitFilterLabel';

const filterNameToLabel = (filterName) => {
  switch (filterName) {
    case 'sport':
      return 'UNIT.FILTER_SPORT';
    case 'status':
      return 'UNIT.FILTER_STATUS';
    default:
      return '';
  }
};

const UnitFilterLabelButton = ({ filter, onAction, isActive, ...rest }) => {
  const { t } = useTranslation();
  const labelMessage = t(filterNameToLabel(filter.name));
  const buttonMessage = t(`UNIT.FILTER.${invert(UnitFilters)[filter.active]}`);

  return (
    <div>
      <UnitFilterLabel message={labelMessage} />
      <UnitFilterButton
        filterName={filter.active}
        className={isActive ? 'active' : ''}
        onClick={() => onAction(filter)}
        showDropdownIndicator
        message={buttonMessage}
        aria-label={[buttonMessage, labelMessage].join(', ')}
        aria-expanded={isActive}
        {...pick(rest, ['aria-haspopup', 'aria-controls', 'id'])}
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
