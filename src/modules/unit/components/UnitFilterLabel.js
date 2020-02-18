import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const filterNameToLabel = (filterName) => {
  switch (filterName) {
    case 'sport': return 'UNIT.FILTER_SPORT';
    case 'status': return 'UNIT.FILTER_STATUS';
    default: return '';
  }
};

const UnitFilterLabel = ({ filterName }) => {
  const { t } = useTranslation();

  const message = filterNameToLabel(filterName);
  if (!message) {
    return null;
  }

  return (
    <div className="unit-filter-label">
      <span>
        {t(message)}
:
      </span>
    </div>
  );
};

UnitFilterLabel.propTypes = {
  filterName: PropTypes.string.isRequired,
};

export default UnitFilterLabel;
