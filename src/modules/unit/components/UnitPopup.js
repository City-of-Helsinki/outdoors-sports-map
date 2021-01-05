/* eslint-disable react/prop-types */

import React from 'react';
import { Popup } from 'react-leaflet';
import { translate } from 'react-i18next';
import { getAttr, getUnitQuality, getCondition } from '../helpers';

const UnitPopup = ({ unit, offset, t }, { getActiveLanguage: getLang }) => {
  const condition = getCondition(unit);
  const conditionLabel = condition
    ? getAttr(condition.name, getLang())
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
          {getAttr(unit.name, getLang())}
        </h6>
      </div>
    </Popup>
  );
};

UnitPopup.contextTypes = {
  getActiveLanguage: React.PropTypes.func,
};

export default translate()(UnitPopup);
