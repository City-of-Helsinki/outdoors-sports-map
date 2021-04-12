import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { getAttr, getUnitQuality, getCondition } from '../helpers';

const UnitPopup = ({ unit, offset }) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();
  const condition = getCondition(unit);
  const conditionLabel = condition
    ? getAttr(condition.name, language)
    : t('UNIT.UNKNOWN');

  return (
    <Popup
      className="unit-popup"
      minWidth={150}
      maxWidth={150}
      offset={[0, offset]}
      closeButton={false}
      autoPan={false}
    >
      <div className="unit-popup__content">
        <div
          className={`unit-popup__content__status unit-popup__content__status--${getUnitQuality(
            unit
          )}`}
        >
          {conditionLabel}
        </div>
        <h6 className="unit-popup__content__name">
          {getAttr(unit.name, language)}
        </h6>
      </div>
    </Popup>
  );
};

UnitPopup.propTypes = {
  offset: PropTypes.number.isRequired,
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UnitPopup;
