import React from 'react';
import { Link } from 'react-router';

const AddressSuggestion = ({ address, handleClick }) => (
  <Link className="search-suggestions__result" onClick={() => handleClick(address.geometry.coordinates.slice().reverse())}>
    <div className="search-suggestions__address-icon">
      <img src={require('../../../../assets/markers/unknown-satisfactory-off.png')} height="21px" />
    </div>
    <div className="search-suggestions__result-details">
      <div className="search-suggestions__result-details__name">{address.properties.label}</div>
    </div>
  </Link>
);

AddressSuggestion.contextTypes = {
  getActiveLanguage: React.PropTypes.func,
};

export default AddressSuggestion;
