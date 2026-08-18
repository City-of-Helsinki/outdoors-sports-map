import get from "lodash/get";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import breaks from "remark-breaks";

import OutboundLink from "../../common/a11y/OutboundLink";
import useLanguage from "../../common/hooks/useLanguage";
import getServiceName from "../service/serviceHelpers";
import { selectServicesObject } from "../service/state/serviceSlice";
import UnitIcon from "../unit/UnitIcon";
import UnitObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from "../unit/UnitObservationStatus";
import { Translatable, Unit } from "../unit/types";
import {
  createPalvelukarttaUrl,
  createReittiopasUrl,
  getAttr,
  getObservation,
  getObservationTime,
} from "../unit/unitHelpers";

type Props = {
  unit: Unit;
  onClose: () => void;
};

function EmbedUnitPanel({ unit, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
  const language = useLanguage();
  const services = useSelector(selectServicesObject);

  const noticeObs = getObservation(unit, "notice");
  const tempObs = getObservation(unit, "temperature");
  const liveTempObs = getObservation(unit, "live_swimming_water_temperature");
  const measuredTempObs = getObservation(
    unit,
    "measured_swimming_water_temperature"
  );
  const uirasTempObs = getObservation(unit, "uiras_swimming_water_temperature");

  // Priority order matches UnitDetails
  const effectiveTempObs =
    measuredTempObs || uirasTempObs || liveTempObs || tempObs;
  const isLiveTemp = !!(measuredTempObs || uirasTempObs || liveTempObs);

  const routeUrl = createReittiopasUrl(unit, language);
  const palvelukarttaUrl = createPalvelukarttaUrl(unit, language);
  const unitWww = getAttr(unit.www, language);

  const unitAddress = getAttr(unit.street_address, language);
  const unitZIP = unit.address_zip;
  const unitMunicipality = unit.municipality;

  return (
    <aside className="embed-unit-panel" aria-labelledby="embed-unit-panel-name">
      <div className="embed-unit-panel__header">
        <button
          className="embed-unit-panel__close"
          type="button"
          onClick={onClose}
          aria-label={t("EMBED_TOOL.CLOSE_PANEL")}
        >
          ×
        </button>
        <h3 id="embed-unit-panel-name" className="embed-unit-panel__name">
          {getAttr(unit.name, language)}
        </h3>
        <div className="embed-unit-panel__description">
          <UnitIcon
            unit={unit}
            alt={getServiceName(unit.services, services, language)}
          />
          <div className="embed-unit-panel__description-text">
            <p className="embed-unit-panel__service-name">
              {getServiceName(unit.services, services, language)}
            </p>
            <p className="embed-unit-panel__address">
              {unitAddress ? `${unitAddress}, ` : ""}
              {unitZIP ? `${unitZIP} ` : ""}
              {unitMunicipality || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="embed-unit-panel__body">
        <div className="embed-unit-panel__section">
          <UnitObservationStatus unit={unit} />
        </div>

        {noticeObs && (
          <div className="embed-unit-panel__section">
            <h4 className="embed-unit-panel__section-title">
              {t("UNIT_BROWSER.NOTICE")}
            </h4>
            <StatusUpdated time={getObservationTime(noticeObs)} />
            <ReactMarkdown
              remarkPlugins={[breaks]}
              allowedElements={["text", "p", "br"]}
            >
              {getAttr(noticeObs.value as Translatable<string>, language) || ""}
            </ReactMarkdown>
          </div>
        )}

        {effectiveTempObs && (
          <div className="embed-unit-panel__section">
            <h4 className="embed-unit-panel__section-title">
              {isLiveTemp
                ? t("UNIT_BROWSER.WATER_TEMPERATURE")
                : t("UNIT_BROWSER.TEMPERATURE")}
            </h4>
            {isLiveTemp ? (
              <StatusUpdatedAgo
                time={getObservationTime(effectiveTempObs)}
                sensorName=""
              />
            ) : (
              <StatusUpdated time={getObservationTime(effectiveTempObs)} />
            )}
            <p>
              {isLiveTemp
                ? `${get(effectiveTempObs, "value.fi") ?? get(effectiveTempObs, "value")} °C`
                : (get(effectiveTempObs, "name.fi") as string)}
            </p>
          </div>
        )}

        {(unit.phone || unitWww) && (
          <div className="embed-unit-panel__section">
            <h4 className="embed-unit-panel__section-title">
              {t("UNIT_BROWSER.INFO")}
            </h4>
            {unit.phone && (
              <p>
                {t("UNIT_DETAILS.PHONE")}:{" "}
                <a href={`tel:${unit.phone}`}>{unit.phone}</a>
              </p>
            )}
            {unitWww && (
              <p>
                <OutboundLink href={unitWww}>
                  {t("UNIT_DETAILS.FURTHER_INFO")}
                </OutboundLink>
              </p>
            )}
          </div>
        )}

        <div className="embed-unit-panel__section">
          <h4 className="embed-unit-panel__section-title">
            {t("UNIT_BROWSER.LINKS")}
          </h4>
          <ul className="embed-unit-panel__links">
            <li>
              <OutboundLink href={routeUrl}>
                {t("UNIT_BROWSER.GET_ROUTE")}
              </OutboundLink>
            </li>
            <li>
              <OutboundLink href={palvelukarttaUrl}>
                {t("UNIT_BROWSER.SEE_ON_SERVICE_MAP")}
              </OutboundLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default EmbedUnitPanel;
