import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const UnitFilterLabel = ({ filterName }) => {
  const { t } = useTranslation();

  const message = filterNameToLabel(filterName);
  if (!message) {
    return null;
  }

  return (
    <div className="unit-filter-label" id={id}>
      <span>{message}:</span>
    </div>
  );
};

UnitFilterLabel.propTypes = {
  filterName: PropTypes.string.isRequired,
};

export default UnitFilterLabel;
