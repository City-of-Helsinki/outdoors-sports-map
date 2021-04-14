// @flow

import React from 'react';
import { Link } from 'react-router-dom';

// $FlowIgnore
const addressIcon = require('@assets/markers/unknown-satisfactory-off.png');

type Props = {
  address: Object,
  handleClick: (coordinates: [number, number]) => void,
};

const AddressSuggestion = ({ address, handleClick }: Props) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <Link
    to=""
    className="search-suggestions__result"
    onClick={(e) => {
      e.preventDefault();
      handleClick(address.geometry.coordinates.slice().reverse());
    }}
  >
    <div className="search-suggestions__address-icon">
      <img src={addressIcon} height="21px" alt="" />
    </div>
    <div className="search-suggestions__result-details">
      <div className="search-suggestions__result-details__name">
        {address.properties.label}
      </div>
    </div>
  </Link>
);

export default AddressSuggestion;
