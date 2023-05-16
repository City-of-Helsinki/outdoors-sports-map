import { useTranslation } from "react-i18next";

import { Unit } from "./unitConstants";
import {
  getAttr,
  getCondition,
  getObservation,
  getObservationTime,
  getUnitQuality,
} from "./unitHelpers";
import Time from "../../common/components/Time";
import TimeAgo from "../../common/components/TimeAgo";
import useLanguage from "../../common/hooks/useLanguage";

type StatusBarProps = {
  quality: string;
  label: String;
};

export function StatusBar({ quality, label }: StatusBarProps) {
  return <div className={`observation-status__bar--${quality}`}>{label}</div>;
}

type StatusUpdatedProps = {
  time: Date;
};

export function StatusUpdated({ time }: StatusUpdatedProps) {
  const { t } = useTranslation();

  return (
    <div
      className="obervation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      {t("UNIT_DETAILS.UPDATED")} <Time time={time} />
    </div>
  );
}

type StatusUpdatedAgoProps = {
  time: Date;
  sensorName: string;
};

export function StatusUpdatedAgo({
  time,
  sensorName = "",
}: StatusUpdatedAgoProps) {
  return (
    <div
      className="obervation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      <TimeAgo time={time} />
      {sensorName && ` (${sensorName})`}
    </div>
  );
}

type MaintenanceUpdatedProps = {
  name: Record<string, any>;
  time: Date;
};

export function MaintenanceUpdated({ name, time }: MaintenanceUpdatedProps) {
  const language = useLanguage();

  return (
    <div
      className="observation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      {getAttr(name, language)} <Time time={time} />
    </div>
  );
}

type ObservationStatusProps = {
  unit: Unit;
};

function ObservationStatus({ unit }: ObservationStatusProps) {
  const { t } = useTranslation();
  const language = useLanguage();

  const quality = getUnitQuality(unit);
  const condition = getCondition(unit);
  const maintenance = getObservation(unit, "maintenance");

  return (
    <div className="observation-status">
      <StatusBar
        quality={quality}
        label={
          condition && condition.name
            ? getAttr(condition.name, language) || t("UNIT_DETAILS.UNKNOWN")
            : t("UNIT_DETAILS.UNKNOWN")
        }
      />
      {condition && <StatusUpdated time={getObservationTime(condition)} />}
      {maintenance && (
        <MaintenanceUpdated
          name={maintenance.name}
          time={getObservationTime(maintenance)}
        />
      )}
    </div>
  );
}

export default ObservationStatus;
