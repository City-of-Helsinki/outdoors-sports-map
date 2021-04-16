import { useTranslation } from "react-i18next";
import { Popup } from "react-leaflet";

import { Unit } from "../constants";
import { getAttr, getCondition, getUnitQuality } from "../helpers";

type Props = {
  offset: number;
  unit: Unit;
};

function UnitPopup({ unit, offset }: Props) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const condition = getCondition(unit);

  const conditionLabel = condition
    ? getAttr(condition.name, language)
    : t("UNIT.UNKNOWN");

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
}

export default UnitPopup;
