import React from 'react';
import { withTranslation } from 'react-i18next';

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

export default withTranslation()(UnitFilterLabel);
