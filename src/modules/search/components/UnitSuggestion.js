// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
// $FlowIgnore
import { useLocation } from 'react-router';

import Link from '../../common/components/Link';
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
  const { search } = useLocation();

  return (
    <Link
      to={{ pathname: `/unit/${unit.id}`, state: { search } }}
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
