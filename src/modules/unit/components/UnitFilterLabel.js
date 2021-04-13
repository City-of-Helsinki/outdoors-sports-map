import React from 'react';
import PropTypes from 'prop-types';

const UnitFilterLabel = ({ message, id }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="unit-filter-label" id={id}>
      <span>{message}:</span>
    </div>
  );
};

UnitFilterLabel.defaultProps = {
  id: undefined,
};

UnitFilterLabel.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default UnitFilterLabel;
