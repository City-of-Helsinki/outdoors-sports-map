import { IconAngleDown, IconStar, IconStarFill } from "hds-react";
import get from "lodash/get";
import has from "lodash/has";
import { ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import breaks from "remark-breaks";

import useSyncUnitNameWithLanguage from "./useSyncUnitNameWithLanguage";
import OutboundLink from "../../../common/a11y/OutboundLink";
import Page from "../../../common/a11y/Page";
import { IconSkiingDogSkijoring, IconSkiingFreestyle, IconSkiingTraditional } from "../../../common/components/CustomIcons";
import Link from "../../../common/components/Link";
import SMIcon from "../../../common/components/SMIcon";
import useLanguage from "../../../common/hooks/useLanguage";
import { AppState } from "../../app/appConstants";
import { UnitDetailsParams } from "../../app/appRoutes";
import { getIsLoading } from "../../app/appSelectors";
import * as fromService from "../../service/selectors";
import getServiceName from "../../service/serviceHelpers";
import UnitIcon from "../UnitIcon";
import UnitObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from "../UnitObservationStatus";
import * as fromUnit from "../state/selectors";
import { Translatable, Unit, UnitConnectionTags } from "../unitConstants";
import {
  createPalvelukarttaUrl,
  createReittiopasUrl,
  getAttr,
  getConnectionByTag,
  getObservation,
  getObservationTime,
  getOpeningHours,
} from "../unitHelpers";


type HeaderProps = {
  unit?: Unit;
  services: Record<string, any>;
  isLoading: boolean;
};

export function Header({ unit, services, isLoading }: HeaderProps) {
  const { t } = useTranslation();
  const language = useLanguage();
  const location = useLocation<{ previous?: string }>();

  const unitAddress = unit ? getAttr(unit.street_address, language) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <div className="unit-container-header">
      <div className="unit-container-header-name">
        <div>
          {isLoading ? (
            <h4>{t("UNIT_BROWSER.LOADING")}</h4>
          ) : (
            <h4>
              {unit
                ? getAttr(unit.name, language)
                : t("UNIT_BROWSER.NOT_FOUND")}
            </h4>
          )}
        </div>
        <div
          style={{
            alignSelf: "center",
          }}
        >
          <Link // If there was a previous saved into location state, re-apply it
            to={location.state?.previous || "/"}
            className="unit-container-close-button close-unit-container"
          >
            <SMIcon icon="close" aria-label={t("UNIT_BROWSER.CLOSE")} />
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

type MobileFooterProps = {
  toggleExpand: () => void;
  isExpanded: boolean;
}
export function MobileFooter({ toggleExpand, isExpanded }: MobileFooterProps) {
  const { t } = useTranslation();
  const footerText = isExpanded ? t("UNIT_DETAILS.SHOW_LESS") : t("UNIT_DETAILS.SHOW_MORE");
  return (
  <div className="unit-details-mobile-footer">
    <div className="unit-details-mobile-footer-expander" onClick={toggleExpand}>
        {footerText}
        <IconAngleDown className={ isExpanded ? "unit-details-mobile-footer-icon-expanded" : "unit-details-mobile-footer-icon"} />
      </div>
  </div>)
}

function isUnitInFavourites(unit: Unit): boolean {
  const favourites = JSON.parse(localStorage.getItem('favouriteUnits') || '[]');
  return favourites.some((favourite: Unit) => favourite.id === unit.id);
}

function toggleFavourite(unit: Unit) {
  const favourites = JSON.parse(localStorage.getItem('favouriteUnits') || '[]');
  const unitIndex = favourites.findIndex((favourite: Unit) => favourite.id === unit.id);

  if (unitIndex === -1) {
    // Add the unit to favourites
    favourites.push(unit);
  } else {
    // Remove the unit from favourites
    favourites.splice(unitIndex, 1);
  }

  localStorage.setItem('favouriteUnits', JSON.stringify(favourites));
};

type AddFavoriteProps = {
  unit: Unit;
};

function AddFavorite({ unit }: AddFavoriteProps) {
  const { t } = useTranslation();
  const [isFavourite, setIsFavourite] = useState(false);
  
  useEffect(() => {
    setIsFavourite(isUnitInFavourites(unit));
  }, [unit]);

  const handleClick = () => {
    toggleFavourite(unit);
    setIsFavourite(!isFavourite);
  };

  return (
    <BodyBox title="">
      <button className="favorite-button" onClick={handleClick}>
        <span className="favorite-button-content">
          <span>{isFavourite ? t("UNIT_BROWSER.REMOVE_FAVOURITE") : t("UNIT_BROWSER.ADD_FAVOURITE")}</span>
          {isFavourite ? <IconStarFill /> : <IconStar />}
        </span>
      </button>
    </BodyBox>
  )
} 

type LocationStateProps = {
  unit: Unit;
};

function LocationState({ unit }: LocationStateProps) {
  const { t } = useTranslation();

  return (
    <BodyBox title={t("UNIT_BROWSER.QUALITY")}>
      <UnitObservationStatus unit={unit} />
    </BodyBox>
  );
}

type LocationInfoProps = {
  unit: Unit;
};

function LocationInfo({ unit }: LocationInfoProps) {
  const { t } = useTranslation();
  const language = useLanguage();

  const unitWww = getAttr(unit.www, language);
  const unitExtraLipasRouteLengthKm = get(
    unit,
    ["extra", "lipas.routeLengthKm"],
    null
  );
  const unitExtraLipasLitRouteLengthKm = get(
    unit,
    ["extra", "lipas.litRouteLengthKm"],
    null
  );
  const unitExtraLipasSkiTrackFreestyle = get(
    unit,
    ["extra", "lipas.skiTrackFreestyle"],
    null
  );
  const unitExtraLipasSkiTrackTraditional = get(
    unit,
    ["extra", "lipas.skiTrackTraditional"],
    null
  );

  const hasExtras =
    // Check against null because value can be 0 which is falsy.
    // Value of 0 will result in "0km"
    // E.g. Route length: 5km, Lit route length: 0km
    unitExtraLipasRouteLengthKm !== null ||
    unitExtraLipasLitRouteLengthKm !== null ||
    // Value is 1 when true, just check truthy
    unitExtraLipasSkiTrackFreestyle ||
    unitExtraLipasSkiTrackTraditional;

  const unitControlConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.CONTROL
  );
  const unitHeatedConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.HEATING
  );
  const unitLightedConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.LIGHTED
  )
  const unitDressingRoomConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.DRESSING_ROOM
  )
  const dogSkijoringTrackConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.DOG_SKIJORING_TRACK
  )
  const unitParkingConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.PARKING
  )
  const unitOtherServicesConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.OTHER_SERVICES
  )
  const unitMoreInfoConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.MORE_INFO
  )
  // Should show info if at least some data is present
  if (
    !(
      unit.phone ||
      unit.url ||
      hasExtras ||
      unitControlConnection ||
      unitHeatedConnection ||
      unitLightedConnection ||
      unitDressingRoomConnection ||
      dogSkijoringTrackConnection
    )
  ) {
    return null;
  }

  return (
    <BodyBox title={t("UNIT_BROWSER.INFO")}>
      {(!!unitExtraLipasSkiTrackFreestyle ||
        !!unitExtraLipasSkiTrackTraditional ||
        dogSkijoringTrackConnection !== undefined) && (
        <>
          <p className="no-margin">
            {t("UNIT_BROWSER.SKIING_TECHNIQUE")}:
          </p>
          <div className="unit-container-body-box-icon-and-value-wrapper">
            {!!unitExtraLipasSkiTrackFreestyle && <span className="unit-container-body-box-icon-and-value">
              <IconSkiingFreestyle /> {t("UNIT_BROWSER.SKIING_TECHNIQUE_FREESTYLE")}
            </span>}
            {!!unitExtraLipasSkiTrackTraditional && <span className="unit-container-body-box-icon-and-value">
              <IconSkiingTraditional /> {t("UNIT_BROWSER.SKIING_TECHNIQUE_TRADITIONAL")}
            </span>}
            {dogSkijoringTrackConnection !== undefined && <span className="unit-container-body-box-icon-and-value">
              <IconSkiingDogSkijoring /> {getAttr(dogSkijoringTrackConnection.name, language) || t("UNIT_DETAILS.DOG_SKIJORING_TRACK")}
            </span>}
          </div>
        </>
      )}
      {unitExtraLipasRouteLengthKm !== null && (
        <p className="no-margin">
          {`${t("UNIT_BROWSER.ROUTE_LENGTH")}: `}
          <span>{unitExtraLipasRouteLengthKm}km</span>
        </p>
      )}
      {unitExtraLipasLitRouteLengthKm !== null && (
        <p className="no-margin">
          {`${t("UNIT_BROWSER.LIT_ROUTE_LENGTH")}: `}
          <span>{unitExtraLipasLitRouteLengthKm}km</span>
        </p>
      )}
      {unitControlConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.CONTROL")}`}:{" "}
          {getAttr(unitControlConnection.name, language)}
        </p>
      )}
      {unitHeatedConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.HEATING")}`}:{" "}
          {getAttr(unitHeatedConnection.name, language)}
        </p>
      )}
      {unitLightedConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.LIGHTED")}`}:{" "}
          {getAttr(unitLightedConnection.name, language)}
        </p>
      )}
      {unitDressingRoomConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.DRESSING_ROOM")}`}:{" "}
          {getAttr(unitDressingRoomConnection.name, language)}
        </p>
      )}
      {unitParkingConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.PARKING")}`}:{" "}
          {getAttr(unitParkingConnection.name, language)}
        </p>
      )}
      {unitOtherServicesConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.OTHER_SERVICES")}`}:{" "}
          {getAttr(unitOtherServicesConnection.name, language)}
        </p>
      )}
      {unitMoreInfoConnection !== undefined && (
        <p className="no-margin">
          {`${t("UNIT_DETAILS.MORE_INFO")}`}:{" "}
          {getAttr(unitMoreInfoConnection.name, language)}
        </p>
      )}
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
  const { t } = useTranslation();
  const language = useLanguage();

  const notice = getObservation(unit, "notice");

  return notice ? (
    <BodyBox title={t("UNIT_BROWSER.NOTICE")}>
      <StatusUpdated time={getObservationTime(notice)} />
      <ReactMarkdown
        children={getAttr(notice.value as Translatable<string>, language)}
        // Insert a break for each newline character
        // https://github.com/rexxars/react-markdown/issues/105#issuecomment-346103734
        remarkPlugins={[breaks]}
        allowedElements={["text", "p", "br"]}
      />
    </BodyBox>
  ) : null;
}

type LocationRouteProps = {
  routeUrl?: string;
  palvelukarttaUrl?: string;
  extraUrl?: string;
};

function LocationRoute({
  routeUrl,
  palvelukarttaUrl,
  extraUrl,
}: LocationRouteProps) {
  const { t } = useTranslation();

  return (
    <BodyBox title={t("UNIT_BROWSER.LINKS")}>
      <ul className="unit-container-body-list">
        {routeUrl && (
          <li>
            <OutboundLink href={routeUrl}>
              {t("UNIT_BROWSER.GET_ROUTE")}
            </OutboundLink>
          </li>
        )}
        {extraUrl && (
          <li>
            <OutboundLink href={extraUrl}>
              {t("UNIT_BROWSER.EXTRA_INFO")}
            </OutboundLink>
          </li>
        )}
        {palvelukarttaUrl && (
          <li>
            <OutboundLink href={palvelukarttaUrl}>
              {t("UNIT_BROWSER.SEE_ON_SERVICE_MAP")}
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
  const { t } = useTranslation();
  const language = useLanguage();

  const openingHours = getOpeningHours(unit, language);

  if (openingHours.length === 0) {
    return null;
  }

  return (
    <BodyBox title={t("UNIT_BROWSER.OPENING_HOURS")}>
      {openingHours.map((openingHour: string) => (
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
    <BodyBox title={t("UNIT_BROWSER.TEMPERATURE")}>
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
    <BodyBox title={t("UNIT_BROWSER.WATER_TEMPERATURE")}>
      <StatusUpdatedAgo
        time={observationTime}
        sensorName={t("UNIT_BROWSER.WATER_TEMPERATURE_SENSOR")}
      />
      {`${temperature} °C`}
    </BodyBox>
  );
}

type LiveWaterQualityProps = {
  observation: Record<string, any>;
};

function LiveWaterQuality({
  observation,
}: LiveWaterQualityProps) {
  const { t } = useTranslation();
  const waterQuality = get(observation, "value.fi");
  const observationTime = getObservationTime(observation);
  
  return (
    <BodyBox title={t("UNIT_BROWSER.WATER_QUALITY")}>
      <StatusUpdatedAgo
        time={observationTime}
        sensorName={""}
      />
      <p className={`water-quality-${waterQuality}`}>{t(`WATER_QUALITY.${waterQuality}`)}</p>
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
  currentUnit?: Unit;
  isLoading: boolean;
  liveTemperatureObservation: Record<string, any> | null | undefined;
  routeUrl?: string;
  temperatureObservation: Record<string, any> | null | undefined;
  palvelukarttaUrl?: string;
  liveWaterQualityObservation: Record<string, any> | null | undefined;
};

export function SingleUnitBody({
  currentUnit,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  temperatureObservation,
  palvelukarttaUrl,
  liveWaterQualityObservation
}: SingleUnitBodyProps) {
  const language = useLanguage();

  let extraUrl: string = "";
  const unitConnections = currentUnit?.connections;
  if (unitConnections) {
    let otherInfo = unitConnections.find((connection) => {
      return connection.section_type === "OTHER_INFO";
    });
    extraUrl = otherInfo?.www?.fi!;
  }

  return currentUnit && !isLoading ? (
    <div className="unit-container-body">
      <LocationState unit={currentUnit} />
      <AddFavorite unit={currentUnit} />
      <NoticeInfo unit={currentUnit} />
      {!liveTemperatureObservation && temperatureObservation && (
        <LocationTemperature observation={temperatureObservation} />
      )}
      {liveTemperatureObservation && (
        <LiveLocationTemperature observation={liveTemperatureObservation} />
      )}
      {
        liveWaterQualityObservation && (
          <LiveWaterQuality observation={liveWaterQualityObservation} />
        )
      }
      <LocationInfo unit={currentUnit} />
      {getOpeningHours(currentUnit, language) && (
        <LocationOpeningHours unit={currentUnit} />
      )}
      {(routeUrl || palvelukarttaUrl) && (
        <LocationRoute
          routeUrl={routeUrl}
          palvelukarttaUrl={palvelukarttaUrl}
          extraUrl={extraUrl}
        />
      )}
    </div>
  ) : null;
}

function findAlternatePathname(pathname: string, unit: Unit, language: string) {
  const base = `${window.location.origin}/${language}/unit/${unit.id}`;
  // @ts-ignore
  const unitName = unit.name[language];

  if (unitName) {
    return `${base}-${encodeURIComponent(unitName)}`;
  }

  return base;
}

type Props = {
  onCenterMapToUnit: (unit: Unit, map: L.Map | null) => void;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
};

function UnitDetails({ onCenterMapToUnit, isExpanded, toggleIsExpanded }: Props) {
  const language = useLanguage();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { unitId } = useParams<UnitDetailsParams>();
  const services = useSelector(fromService.getServicesObject);
  const unit = useSelector<AppState, Unit | undefined>((state) =>
    fromUnit.getUnitById(state, {
      id: unitId,
    })
  );
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    if (unit) {
      // Center map on the unit
      onCenterMapToUnit(unit, null);
    }
  }, [unit, onCenterMapToUnit]);
  useSyncUnitNameWithLanguage(unit);

  const temperatureObservation =
    unit && has(unit, "observations")
      ? getObservation(unit, "swimming_water_temperature")
      : null;
  const liveTemperatureObservation =
    unit && has(unit, "observations")
      ? getObservation(unit, "live_swimming_water_temperature")
      : null;
  const liveWaterQualityObservation =
    unit && has(unit, "observations")
      ? getObservation(unit, "live_swimming_water_quality")
      : null;
  const routeUrl = unit && createReittiopasUrl(unit, language);
  const palvelukarttaUrl = unit && createPalvelukarttaUrl(unit, language);
  const isOpen = !!unitId;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {unit && (
        <Helmet>
          <link
            href="alternate"
            lang="fi"
            hrefLang={findAlternatePathname(pathname, unit, "fi")}
          />
          <link
            href="alternate"
            lang="sv"
            hrefLang={findAlternatePathname(pathname, unit, "sv")}
          />
          <link
            href="alternate"
            lang="en"
            hrefLang={findAlternatePathname(pathname, unit, "en")}
          />
        </Helmet>
      )}
      <Page
        title={
          unit?.name
            ? `${getAttr(unit?.name, language) || ""} | ${t("APP.NAME")}`
            : t("APP.NAME")
        }
        description={
          unit?.description ? getAttr(unit?.description, language) : undefined
        }
        image={unit?.picture_url}
        className={isExpanded ? "unit-container expanded" : "unit-container"}
      >
        <Header unit={unit} services={services} isLoading={isLoading} />
        <SingleUnitBody
          currentUnit={unit}
          isLoading={isLoading}
          liveTemperatureObservation={liveTemperatureObservation}
          routeUrl={routeUrl}
          temperatureObservation={temperatureObservation}
          liveWaterQualityObservation={liveWaterQualityObservation}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      </Page>
      <MobileFooter toggleExpand={toggleIsExpanded} isExpanded={isExpanded} />
    </>
  );
}

export default UnitDetails;
