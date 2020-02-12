/*
   eslint-disable
   react/destructuring-assignment,
   react/jsx-props-no-spreading,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Link } from 'react-router';
import ObservationStatus from '../../unit/components/ObservationStatus';
import { getAttr } from '../../unit/helpers';
import UnitIcon from '../../unit/components/UnitIcon';
import LanguageContext from '../../common/LanguageContext';

const UnitSuggestion = ({ unit, handleClick, ...rest }) => {
  const { activeLanguage } = useContext(LanguageContext);

  return (
    <Link to={`/unit/${unit.id}`} onClick={(e) => { e.preventDefault(); handleClick(); }} className="search-suggestions__result" {...rest}>
      <div className="search-suggestions__result-icon">
        <UnitIcon unit={unit} />
      </div>
      <div className="search-suggestions__result-details">
        <div className="search-suggestions__result-details__name">{getAttr(unit.name, activeLanguage)}</div>
        <ObservationStatus unit={unit} />
      </div>
    </Link>
  );
};

UnitSuggestion.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func,
};

export default UnitSuggestion;
