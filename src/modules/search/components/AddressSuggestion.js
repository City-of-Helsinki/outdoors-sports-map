/*
   eslint-disable
   jsx-a11y/alt-text,
   jsx-a11y/anchor-is-valid,
   react/prop-types,
*/

import React from 'react';
import { Link } from 'react-router-dom';

const addressIcon = require('@assets/markers/unknown-satisfactory-off.png');

const AddressSuggestion = ({ address, handleClick }) => (
  <Link
    className="search-suggestions__result"
    onClick={() => handleClick(address.geometry.coordinates.slice().reverse())}
  >
    <div className="search-suggestions__address-icon">
      <img src={addressIcon} height="21px" />
    </div>
    <div className="search-suggestions__result-details">
      <div className="search-suggestions__result-details__name">
        {address.properties.label}
      </div>
    </div>
  </Link>
);

export default AddressSuggestion;
