import React from 'react';

// eslint-disable-next-line react/prop-types
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

export default UnitFilterLabel;
