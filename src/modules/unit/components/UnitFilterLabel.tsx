import PropTypes from "prop-types";
import React from "react";

function UnitFilterLabel({ message, id }) {
  if (!message) {
    return null;
  }

  return (
    <div className="unit-filter-label" id={id}>
      <span>{message}:</span>
    </div>
  );
}

UnitFilterLabel.defaultProps = {
  id: undefined,
};
UnitFilterLabel.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default UnitFilterLabel;
