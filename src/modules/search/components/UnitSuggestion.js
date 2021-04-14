// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ObservationStatus from '../../unit/components/ObservationStatus';
import { getAttr } from '../../unit/helpers';
import UnitIcon from '../../unit/components/UnitIcon';

type Props = {
  unit: Object,
};

const UnitSuggestion = ({ unit, ...rest }: Props) => {
  const {
    i18n: {
      languages: [language],
    },
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

export default UnitSuggestion;
