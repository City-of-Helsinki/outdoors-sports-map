import get from "lodash/get";
import has from "lodash/has";
import upperFirst from "lodash/upperFirst";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router";
// @ts-ignore
import breaks from "remark-breaks";

import Link from "../../common/components/Link";
import OutboundLink from "../../common/components/OutboundLink";
import SMIcon from "../../home/components/SMIcon";
import getServiceName from "../../service/helpers";
import { Unit } from "../constants";
import {
  createPalvelukarttaUrl,
  createReittiopasUrl,
  getAttr,
  getObservation,
  getObservationTime,
  getOpeningHours,
} from "../helpers";
import ObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from "./ObservationStatus";
import UnitIcon from "./UnitIcon";

function shouldShowInfo(unit: Unit) {
  const hasExtensions =
    unit.extensions &&
    (unit.extensions.length ||
      unit.extensions.lighting ||
      unit.extensions.skiing_technique);

  // Should show info if at least some interesting extension is available,
  // or if there's a phone or a unit number
  return hasExtensions || unit.phone || unit.url;
}

type HeaderProps = {
  unit: Unit;
  services: Record<string, any>;
  isLoading: boolean;
};

export function Header({ unit, services, isLoading }: HeaderProps) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const location = useLocation<{ search: string }>();
  const unitAddress = unit ? getAttr(unit.street_address, language) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <div className="unit-container-header">
      <div className="unit-container-header-name">
        <div>
          {isLoading ? (
            <h4>{t("UNIT_CONTAINER.LOADING")}</h4>
          ) : (
            <h4>
              {unit
                ? getAttr(unit.name, language)
                : t("UNIT_CONTAINER.NOT_FOUND")}
            </h4>
          )}
        </div>
        <div
          style={{
            alignSelf: "center",
          }}
        >
          <Link // If there was a search saved into location state, re-apply it
            to={`/${location.state ? location.state.search : ""}`}
            className="unit-container-close-button close-unit-container"
          >
            <SMIcon icon="close" aria-label={t("UNIT_CONTAINER.CLOSE")} />
          </Link>
        </div>
      </div>
      {unit ? (
        <div className="unit-container-header-description">
          <UnitIcon
            unit={unit}
            alt={getServiceName(unit.services, services, language)}
          />
          <div>
            <p>{getServiceName(unit.services, services, language)}</p>
            <p>
              {unitAddress ? `${unitAddress}, ` : ""}
              {unitZIP ? `${unitZIP} ` : ""}
              <span
                style={{
                  textTransform: "capitalize",
                }}
              >
                {unitMunicipality || ""}
              </span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type LocationStateProps = {
  unit: Unit;
};

function LocationState({ unit }: LocationStateProps) {
  const { t } = useTranslation();

  return (
    <BodyBox title={t("UNIT_CONTAINER.QUALITY")}>
      <ObservationStatus unit={unit} />
    </BodyBox>
  );
}

type LocationInfoProps = {
  unit: Unit;
};

function LocationInfo({ unit }: LocationInfoProps) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const unitWww = getAttr(unit.www, language);
  const unitExtensionLength = get(unit, "extensions.length");
  const unitExtensionLighting = unit?.extensions?.lighting
    ? upperFirst(getAttr(unit.extensions.lighting, language))
    : null;
  const unitExtensionSkiingTechnique = get(unit, "extensions.skiing_technique");

  return (
    <BodyBox title={t("UNIT_CONTAINER.INFO")}>
      {unitExtensionLength && (
        <p>
          {`${t("UNIT_CONTAINER.LENGTH")}: `}
          <strong>
            {unitExtensionLength}
            km
          </strong>
        </p>
      )}
      {get(unit, "extensions.lighting") && (
        <p>
          {`${t("UNIT_CONTAINER.LIGHTING")}: `}
          <strong>{unitExtensionLighting}</strong>
        </p>
      )}
      {unitExtensionSkiingTechnique && (
        <p>
          {`${t("UNIT_CONTAINER.SKIING_TECHNIQUE")}: `}
          <strong>{unitExtensionSkiingTechnique}</strong>
        </p>
      )}
      {unit.phone && (
        <p>
          {t("UNIT.PHONE")}: <a href={`tel:${unit.phone}`}>{unit.phone}</a>
        </p>
      )}
      {unitWww && (
        <p>
          <OutboundLink href={unitWww}>{t("UNIT.FURTHER_INFO")}</OutboundLink>
        </p>
      )}
    </BodyBox>
  );
}

type NoticeInfoProps = {
  unit: Unit;
};

/**
 * [NoticeInfo description]
 * @param {Object} unit       [description]
 */
function NoticeInfo({ unit }: NoticeInfoProps) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const notice = getObservation(unit, "notice");

  return notice ? (
    <BodyBox title={t("UNIT_CONTAINER.NOTICE")}>
      <StatusUpdated time={getObservationTime(notice)} />
      <ReactMarkdown
        source={getAttr(notice.value, language)} // Insert a break for each newline character
        // https://github.com/rexxars/react-markdown/issues/105#issuecomment-346103734
        plugins={[breaks]}
        escapeHtml
        allowedTypes={["text", "paragraph", "break"]}
      />
    </BodyBox>
  ) : null;
}

type LocationRouteProps = {
  routeUrl: string;
  palvelukarttaUrl: string;
};

function LocationRoute({ routeUrl, palvelukarttaUrl }: LocationRouteProps) {
  const { t } = useTranslation();

  return (
    <BodyBox title={t("UNIT_CONTAINER.LINKS")}>
      <ul className="unit-container-body-list">
        {routeUrl && (
          <li>
            <OutboundLink href={routeUrl}>
              {t("UNIT_CONTAINER.GET_ROUTE")}
            </OutboundLink>
          </li>
        )}
        {palvelukarttaUrl && (
          <li>
            <OutboundLink href={palvelukarttaUrl}>
              {t("UNIT_CONTAINER.SEE_ON_SERVICE_MAP")}
            </OutboundLink>
          </li>
        )}
      </ul>
    </BodyBox>
  );
}

type LocationOpeningHoursProps = {
  unit: Unit;
};

function LocationOpeningHours({ unit }: LocationOpeningHoursProps) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const openingHours = getOpeningHours(unit, language);

  if (openingHours.length === 0) {
    return null;
  }

  return (
    <BodyBox title={t("UNIT_CONTAINER.OPENING_HOURS")}>
      {openingHours.map((openingHour) => (
        <div key={openingHour} className="unit-container-body-multi-line">
          {openingHour}
        </div>
      ))}
    </BodyBox>
  );
}

type LocationTemperatureProps = {
  observation: Record<string, any>;
};

function LocationTemperature({ observation }: LocationTemperatureProps) {
  const { t } = useTranslation();
  const temperature = get(observation, "name.fi");
  const observationTime = getObservationTime(observation);

  return (
    <BodyBox title={t("UNIT_CONTAINER.TEMPERATURE")}>
      <StatusUpdated time={observationTime} />
      {temperature}
    </BodyBox>
  );
}

type LiveLocationTemperatureProps = {
  observation: Record<string, any>;
};

function LiveLocationTemperature({
  observation,
}: LiveLocationTemperatureProps) {
  const { t } = useTranslation();
  const temperature = get(observation, "value.fi");
  const observationTime = getObservationTime(observation);

  return (
    <BodyBox title={t("UNIT_CONTAINER.WATER_TEMPERATURE")}>
      <StatusUpdatedAgo
        time={observationTime}
        sensorName={t("UNIT_CONTAINER.WATER_TEMPERATURE_SENSOR")}
      />
      {`${temperature} °C`}
    </BodyBox>
  );
}

type BodyBoxProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

function BodyBox({ title, children, className = "", ...rest }: BodyBoxProps) {
  return (
    <div className={`${className} unit-container-body-box`} {...rest}>
      {title && <div className="unit-container-body-box-headline">{title}</div>}
      {children}
    </div>
  );
}

type SingleUnitBodyProps = {
  currentUnit: Unit;
  isLoading: boolean;
  liveTemperatureObservation: Record<string, any> | null | undefined;
  routeUrl: string;
  temperatureObservation: Record<string, any> | null | undefined;
  palvelukarttaUrl: string;
};

export function SingleUnitBody({
  currentUnit,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  temperatureObservation,
  palvelukarttaUrl,
}: SingleUnitBodyProps) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return currentUnit && !isLoading ? (
    <div className="unit-container-body">
      <LocationState unit={currentUnit} />
      <NoticeInfo unit={currentUnit} />
      {!liveTemperatureObservation && temperatureObservation && (
        <LocationTemperature observation={temperatureObservation} />
      )}
      {liveTemperatureObservation && (
        <LiveLocationTemperature observation={liveTemperatureObservation} />
      )}
      {shouldShowInfo(currentUnit) && <LocationInfo unit={currentUnit} />}
      {getOpeningHours(currentUnit, language) && (
        <LocationOpeningHours unit={currentUnit} />
      )}
      {(routeUrl || palvelukarttaUrl) && (
        <LocationRoute
          routeUrl={routeUrl}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      )}
    </div>
  ) : null;
}

type Props = {
  isLoading: boolean;
  unit: Unit;
  services: Record<string, any>;
  isOpen: boolean;
};

function SingleUnitContainer({
  isLoading,
  unit: currentUnit,
  services,
  isOpen,
}: Props) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const temperatureObservation = has(currentUnit, "observations")
    ? getObservation(currentUnit, "swimming_water_temperature")
    : null;

  const liveTemperatureObservation = has(currentUnit, "observations")
    ? getObservation(currentUnit, "live_swimming_water_temperature")
    : null;

  const routeUrl = currentUnit && createReittiopasUrl(currentUnit, language);

  const palvelukarttaUrl =
    currentUnit && createPalvelukarttaUrl(currentUnit, language);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="unit-container">
      <Header unit={currentUnit} services={services} isLoading={isLoading} />
      <SingleUnitBody
        currentUnit={currentUnit}
        isLoading={isLoading}
        liveTemperatureObservation={liveTemperatureObservation}
        routeUrl={routeUrl}
        temperatureObservation={temperatureObservation}
        palvelukarttaUrl={palvelukarttaUrl}
      />
    </div>
  );
}

export default SingleUnitContainer;
