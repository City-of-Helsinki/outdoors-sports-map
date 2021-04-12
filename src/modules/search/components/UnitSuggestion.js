/*
   eslint-disable
   react/destructuring-assignment,
   react/jsx-props-no-spreading,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ObservationStatus from '../../unit/components/ObservationStatus';
import { getAttr } from '../../unit/helpers';
import UnitIcon from '../../unit/components/UnitIcon';

const UnitSuggestion = ({ unit, ...rest }) => {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <Link
      to={`/unit/${unit.id}`}
      className="search-suggestions__result"
      {...rest}
    >
      <div className="search-suggestions__result-icon">
        <UnitIcon unit={unit} />
      </div>
      <div className="search-suggestions__result-details">
        <div className="search-suggestions__result-details__name">
          {getAttr(unit.name, language)}
        </div>
        <ObservationStatus unit={unit} />
      </div>
    </Link>
  );
};

UnitSuggestion.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UnitSuggestion;
