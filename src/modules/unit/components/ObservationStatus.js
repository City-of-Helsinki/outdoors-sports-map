/*
   eslint-disable
   react/destructuring-assignment,
   react/prop-types,
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import Time from '../../home/components/Time';
import TimeAgo from '../../home/components/TimeAgo';
import {
  getUnitQuality,
  getObservation,
  getCondition,
  getObservationTime,
  getAttr,
} from '../helpers';

export const StatusBar = ({ quality, label }) => (
  <div className={`observation-status__bar--${quality}`}>{label}</div>
);

export const StatusUpdated = ({ time }) => {
  const { t } = useTranslation();

  return (
    <div className="obervation-status__time" style={{ fontSize: 12 }}>
      {t('UNIT.UPDATED')} <Time time={time} />
    </div>
  );
};

export const StatusUpdatedAgo = ({ time, sensorName = '' }) => (
  <div className="obervation-status__time" style={{ fontSize: 12 }}>
    <TimeAgo time={time} />
    {sensorName && ` (${sensorName})`}
  </div>
);

export const MaintenanceUpdated = ({ name, time }) => {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <div className="observation-status__time" style={{ fontSize: 12 }}>
      {getAttr(name, language)} <Time time={time} />
    </div>
  );
};

const ObservationStatus = ({ unit }) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const quality = getUnitQuality(unit);
  const condition = getCondition(unit);
  const maintenance = getObservation(unit, 'maintenance');

  return (
    <div className="observation-status">
      <StatusBar
        quality={quality}
        label={
          condition && condition.name
            ? getAttr(condition.name, language)
            : t('UNIT.UNKNOWN')
        }
      />
      <StatusUpdated t={t} time={getObservationTime(condition)} />
      {maintenance && (
        <MaintenanceUpdated
          name={maintenance.name}
          activeLang={language}
          time={getObservationTime(maintenance)}
        />
      )}
    </div>
  );
};

export default ObservationStatus;
