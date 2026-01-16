import {
  Button,
  ButtonSize,
  ButtonVariant,
  IconAngleDown,
  LoadingSpinner,
  Tag,
} from "hds-react";
import get from "lodash/get";
import has from "lodash/has";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import breaks from "remark-breaks";

import useSyncUnitNameWithLanguage from "./useSyncUnitNameWithLanguage";
import OutboundLink from "../../../common/a11y/OutboundLink";
import Page from "../../../common/a11y/Page";
import BackLink from "../../../common/components/BackLink";
import {
  IconSkiingDogSkijoring,
  IconSkiingFreestyle,
  IconSkiingTraditional,
} from "../../../common/components/CustomIcons";
import FavoriteButton from "../../../common/components/FavoriteButton";
import useLanguage from "../../../common/hooks/useLanguage";
import { UnitDetailsParams } from "../../app/appRoutes";
import { AppState } from "../../app/types";
import getServiceName from "../../service/serviceHelpers";
import { selectServicesObject, Service } from "../../service/state/serviceSlice";
import UnitIcon from "../UnitIcon";
import UnitObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from "../UnitObservationStatus";
import { selectUnitById, useGetUnitByIdQuery } from "../state/unitSlice";
import { Translatable, Unit } from "../types";
import { UnitConnectionTags } from "../unitConstants";
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
  services: Record<string, Service>;
  isLoading: boolean;
};

export function Header({ unit, services, isLoading }: HeaderProps) {
  const { t } = useTranslation();
  const language = useLanguage();

  const unitAddress = unit ? getAttr(unit.street_address, language) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <div className="unit-container-header">
      <div className="unit-container-header-name-bar">
        <BackLink label={t("UNIT_DETAILS.BACK")} />
        <div>
          {isLoading ? (
            <div className="unit-container-header-name-wrapper">
              <LoadingSpinner
                small={true}
                theme={{ "--spinner-color": "var(--color-white)" }}
                loadingText={t("UNIT_BROWSER.LOADING")}
                loadingFinishedText={t("UNIT_BROWSER.LOADING_FINISHED")}
              />
              <h3>{t("UNIT_BROWSER.LOADING")}</h3>
            </div>
          ) : (
            <h3>
              {unit
                ? getAttr(unit.name, language)
                : t("UNIT_BROWSER.NOT_FOUND")}
            </h3>
          )}
        </div>
        <div
          style={{
            alignSelf: "center",
          }}
        ></div>
      </div>
      {unit ? (
        <div className="unit-container-header-description">
          <UnitIcon
            unit={unit}
            alt={getServiceName(unit.services, services as Record<string, Service>, language)}
          />
          <div className="unit-container-header-description-text-content">
            <p className="unit-container-header-service-name">
              {getServiceName(unit.services, services as Record<string, Service>, language)}
            </p>
            <p>
              {unitAddress ? `${unitAddress}, ` : ""}
              {unitZIP ? `${unitZIP} ` : ""}
              <span className="unit-container-header-unit-address-municipality">
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
  onFooterHeightChange?: (height: number) => void;
  toggleExpand: () => void;
  isExpanded: boolean;
};
export function MobileFooter({
  onFooterHeightChange,
  toggleExpand,
  isExpanded,
}: Readonly<MobileFooterProps>) {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const footerText = isExpanded
    ? t("UNIT_DETAILS.SHOW_LESS")
    : t("UNIT_DETAILS.SHOW_MORE");

  useEffect(() => {
    if (onFooterHeightChange) {
      const footerElement = footerRef.current;
      if (footerElement) {
        onFooterHeightChange(footerElement.clientHeight);
      }
    }
  }, [isExpanded, onFooterHeightChange]);

  return (
    <div className="unit-details-mobile-footer" ref={footerRef}>
      <Button
        className="unit-details-mobile-footer-expander"
        onClick={toggleExpand}
        size={ButtonSize.Small}
        variant={ButtonVariant.Supplementary}
        iconEnd={
          <IconAngleDown
            className={
              isExpanded
                ? "unit-details-mobile-footer-icon-expanded"
                : "unit-details-mobile-footer-icon"
            }
          />
        }
      >
        {footerText}
      </Button>
    </div>
  );
}

function isUnitInFavourites(unit: Unit): boolean {
  const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
  return favourites.some((favourite: Unit) => favourite.id === unit.id);
}

function toggleFavourite(unit: Unit) {
  const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
  const unitIndex = favourites.findIndex(
    (favourite: Unit) => favourite.id === unit.id,
  );

  if (unitIndex === -1) {
    // Add the unit to favourites
    favourites.push(unit);
  } else {
    // Remove the unit from favourites
    favourites.splice(unitIndex, 1);
  }

  localStorage.setItem("favouriteUnits", JSON.stringify(favourites));
}

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
    <BodyBox className="no-margin-top" title="">
      <FavoriteButton
        onClick={handleClick}
        isFavorite={isFavourite}
        addFavoriteText={t("UNIT_BROWSER.ADD_FAVOURITE")}
        removeFavoriteText={t("UNIT_BROWSER.REMOVE_FAVOURITE")}
      />
    </BodyBox>
  );
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
    null,
  );
  const unitExtraLipasLitRouteLengthKm = get(
    unit,
    ["extra", "lipas.litRouteLengthKm"],
    null,
  );
  const unitExtraLipasSkiTrackFreestyle = get(
    unit,
    ["extra", "lipas.skiTrackFreestyle"],
    null,
  );
  const unitExtraLipasSkiTrackTraditional = get(
    unit,
    ["extra", "lipas.skiTrackTraditional"],
    null,
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
    UnitConnectionTags.CONTROL,
  );
  const unitHeatedConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.HEATING,
  );
  const unitLightedConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.LIGHTED,
  );
  const unitDressingRoomConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.DRESSING_ROOM,
  );
  const dogSkijoringTrackConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.DOG_SKIJORING_TRACK,
  );
  const unitParkingConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.PARKING,
  );
  const unitOtherServicesConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.OTHER_SERVICES,
  );
  const unitMoreInfoConnection = getConnectionByTag(
    unit,
    UnitConnectionTags.MORE_INFO,
  );
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
          <p className="small-margin">{t("UNIT_BROWSER.SKIING_TECHNIQUE")}:</p>
          <div className="unit-container-body-box-icon-and-value-wrapper">
            {[
              {
                condition: !!unitExtraLipasSkiTrackFreestyle,
                icon: <IconSkiingFreestyle />,
                value: t("UNIT_BROWSER.SKIING_TECHNIQUE_FREESTYLE"),
              },
              {
                condition: !!unitExtraLipasSkiTrackTraditional,
                icon: <IconSkiingTraditional />,
                value: t("UNIT_BROWSER.SKIING_TECHNIQUE_TRADITIONAL"),
              },
              {
                condition: dogSkijoringTrackConnection !== undefined,
                icon: <IconSkiingDogSkijoring />,
                value:
                  (dogSkijoringTrackConnection &&
                    getAttr(dogSkijoringTrackConnection.name, language)) ||
                  t("UNIT_DETAILS.DOG_SKIJORING_TRACK"),
              },
            ]
              .filter((technique) => technique.condition)
              .map((technique) => (
                <BodyBoxIconAndValue
                  key={technique.value}
                  icon={technique.icon}
                  value={technique.value}
                />
              ))}
          </div>
        </>
      )}
      {/* Route lengths */}
      {[
        {
          value: unitExtraLipasRouteLengthKm,
          labelKey: "UNIT_BROWSER.ROUTE_LENGTH",
        },
        {
          value: unitExtraLipasLitRouteLengthKm,
          labelKey: "UNIT_BROWSER.LIT_ROUTE_LENGTH",
        },
      ]
        .filter((item) => item.value !== null)
        .map(({ value, labelKey }) => (
          <p key={labelKey} className="small-margin">
            {`${t(labelKey)}: `}
            <span>{value}km</span>
          </p>
        ))}

      {/* Connection details */}
      {[
        { connection: unitControlConnection, labelKey: "UNIT_DETAILS.CONTROL" },
        { connection: unitHeatedConnection, labelKey: "UNIT_DETAILS.HEATING" },
        { connection: unitLightedConnection, labelKey: "UNIT_DETAILS.LIGHTED" },
        {
          connection: unitDressingRoomConnection,
          labelKey: "UNIT_DETAILS.DRESSING_ROOM",
        },
        { connection: unitParkingConnection, labelKey: "UNIT_DETAILS.PARKING" },
        {
          connection: unitOtherServicesConnection,
          labelKey: "UNIT_DETAILS.OTHER_SERVICES",
        },
        {
          connection: unitMoreInfoConnection,
          labelKey: "UNIT_DETAILS.MORE_INFO",
        },
      ]
        .filter((item) => item.connection !== undefined)
        .map(({ connection, labelKey }) => (
          <p key={labelKey} className="small-margin">
            {`${t(labelKey)}`}: {getAttr(connection!.name, language)}
          </p>
        ))}
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
        // Insert a break for each newline character
        // https://github.com/rexxars/react-markdown/issues/105#issuecomment-346103734
        remarkPlugins={[breaks]}
        allowedElements={["text", "p", "br"]}
      >
        {getAttr(notice.value as Translatable<string>, language)}
      </ReactMarkdown>
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

  const links = [
    { url: routeUrl, labelKey: "UNIT_BROWSER.GET_ROUTE" },
    { url: extraUrl, labelKey: "UNIT_BROWSER.EXTRA_INFO" },
    { url: palvelukarttaUrl, labelKey: "UNIT_BROWSER.SEE_ON_SERVICE_MAP" },
  ].filter((link) => link.url);

  return (
    <BodyBox title={t("UNIT_BROWSER.LINKS")}>
      <ul className="unit-container-body-list">
        {links.map(
          ({ url, labelKey }) =>
            url && (
              <li key={labelKey}>
                <OutboundLink href={url}>{t(labelKey)}</OutboundLink>
              </li>
            ),
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
  observation: Record<string, unknown>;
};

function LocationTemperature({ observation }: LocationTemperatureProps) {
  const { t } = useTranslation();
  const temperature = get(observation, "name.fi") as string;
  const observationTime = getObservationTime(observation);

  return (
    <BodyBox title={t("UNIT_BROWSER.TEMPERATURE")}>
      <StatusUpdated time={observationTime} />
      {temperature}
    </BodyBox>
  );
}

type LiveLocationTemperatureProps = {
  observation: Record<string, unknown>;
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
  observation: Record<string, unknown>;
};

function LiveWaterQuality({ observation }: Readonly<LiveWaterQualityProps>) {
  const { t } = useTranslation();
  const waterQuality = get(observation, "value.fi");
  const observationTime = getObservationTime(observation);

  return (
    <BodyBox title={t("UNIT_BROWSER.WATER_QUALITY")}>
      <Tag className={`water-quality-${waterQuality}`}>
        {t(`WATER_QUALITY.${waterQuality}`)}
      </Tag>
      <StatusUpdatedAgo time={observationTime} sensorName={""} />
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
      {title && <h4 className="unit-container-body-box-headline">{title}</h4>}
      {children}
    </div>
  );
}

type BodyBoxIconAndValueProps = {
  icon: ReactNode;
  value: ReactNode;
};

function BodyBoxIconAndValue({
  icon,
  value,
}: Readonly<BodyBoxIconAndValueProps>) {
  return (
    <div className="unit-container-body-box-icon-and-value">
      {icon}
      {value}
    </div>
  );
}

type SingleUnitBodyProps = {
  currentUnit?: Unit;
  isLoading: boolean;
  liveTemperatureObservation: Record<string, unknown> | null | undefined;
  routeUrl?: string;
  temperatureObservation: Record<string, unknown> | null | undefined;
  palvelukarttaUrl?: string;
  liveWaterQualityObservation: Record<string, unknown> | null | undefined;
};

export function SingleUnitBody({
  currentUnit,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  temperatureObservation,
  palvelukarttaUrl,
  liveWaterQualityObservation,
}: SingleUnitBodyProps) {
  const language = useLanguage();

  let extraUrl: string = "";
  const unitConnections = currentUnit?.connections;
  if (unitConnections) {
    let otherInfo = unitConnections.find((connection) => {
      return connection.section_type === "OTHER_INFO";
    });
    extraUrl = otherInfo?.www?.fi as string;
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
      {liveWaterQualityObservation && (
        <LiveWaterQuality observation={liveWaterQualityObservation} />
      )}
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
  const base = `${globalThis.location.origin}/${language}/unit/${unit.id}`;
  // @ts-expect-error - unit.name[language] may not exist but we handle the undefined case
  const unitName = unit.name[language];

  if (unitName) {
    return `${base}-${encodeURIComponent(unitName)}`;
  }

  return base;
}

type Props = {
  headerHeight: number;
  onCenterMapToUnit: (unit: Unit, map: L.Map | null) => void;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
};

// Helper function to extract observations from unit
function getUnitObservations(unit: Unit | undefined) {
  if (!unit || !has(unit, "observations")) {
    return {
      temperatureObservation: null,
      liveTemperatureObservation: null,
      liveWaterQualityObservation: null,
    };
  }

  return {
    temperatureObservation: getObservation(unit, "swimming_water_temperature"),
    liveTemperatureObservation: getObservation(unit, "live_swimming_water_temperature"),
    liveWaterQualityObservation: getObservation(unit, "live_swimming_water_quality"),
  };
}

type UnitNotFoundProps = {
  headerHeight: number;
  footerHeight: number;
  services: Record<string, Service>;
};

// Helper function to handle not found case
function UnitNotFound({ headerHeight, footerHeight, services }: Readonly<UnitNotFoundProps>) {
  const { t } = useTranslation();
  
  return (
    <Page
      title={t("APP.NAME")}
      className="unit-container"
      style={{
        "--header-height": `${headerHeight}px`,
        "--footer-height": `${footerHeight}px`,
      } as React.CSSProperties}
    >
      <Header unit={undefined} services={services} isLoading={false} />
      <div className="unit-container-body">
        <p>{t("UNIT_BROWSER.NOT_FOUND")}</p>
      </div>
    </Page>
  );
}

function UnitDetails({
  headerHeight,
  onCenterMapToUnit,
  isExpanded,
  toggleIsExpanded,
}: Readonly<Props>) {
  const language = useLanguage();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { unitId } = useParams<UnitDetailsParams>();
  const services = useSelector(selectServicesObject);
  
  // Use the new unit by ID query instead of getting from existing state
  const { 
    data: unit, 
    isLoading: unitIsLoading, 
    error: unitError
  } = useGetUnitByIdQuery(unitId || '', {
    skip: !unitId,
    // Keep data fresh for 5 minutes
    refetchOnMountOrArgChange: 300,
    // Show cached data while refetching
    refetchOnFocus: true,
  });
  
  // Fallback to existing state if unit not found via API (for backwards compatibility)
  const fallbackUnit = useSelector<AppState, Unit | undefined>((state) =>
    selectUnitById(state, {
      id: unitId,
    }),
  );
  
  // Start with list unit for immediate display, upgrade to API unit for enhanced data (3D geometry, etc.)
  // Only use unit data if it matches the current unitId to prevent showing stale cached data
  const validUnit = String(unit?.id) === unitId ? unit : undefined;
  const validFallbackUnit = String(fallbackUnit?.id) === unitId ? fallbackUnit : undefined;
  const currentUnit = validUnit || validFallbackUnit;
  
  const [footerHeight, setFooterHeight] = useState<number>(0);
  
  // Dedicated loading states
  const isUnitLoading = unitIsLoading && !currentUnit; // Show loading only if we don't have any unit data

  useEffect(() => {
    if (currentUnit) {
      // Center map on the unit
      onCenterMapToUnit(currentUnit, null);
    }
  }, [currentUnit, onCenterMapToUnit]);
  
  useSyncUnitNameWithLanguage(currentUnit);

  // Handle unit not found case (only if no fallback data available)
  if (unitError && !currentUnit && !unitIsLoading) {
    return <UnitNotFound headerHeight={headerHeight} footerHeight={footerHeight} services={services} />;
  }

  // Extract observations using helper function
  const { temperatureObservation, liveTemperatureObservation, liveWaterQualityObservation } = 
    getUnitObservations(currentUnit);
  
  const routeUrl = currentUnit && createReittiopasUrl(currentUnit, language);
  const palvelukarttaUrl = currentUnit && createPalvelukarttaUrl(currentUnit, language);
  const isOpen = !!unitId;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {currentUnit && (
        <Helmet>
          <link
            href="alternate"
            lang="fi"
            hrefLang={findAlternatePathname(pathname, currentUnit, "fi")}
          />
          <link
            href="alternate"
            lang="sv"
            hrefLang={findAlternatePathname(pathname, currentUnit, "sv")}
          />
          <link
            href="alternate"
            lang="en"
            hrefLang={findAlternatePathname(pathname, currentUnit, "en")}
          />
        </Helmet>
      )}
      <Page
        title={
          currentUnit?.name
            ? `${getAttr(currentUnit?.name, language) || ""} | ${t("APP.NAME")}`
            : t("APP.NAME")
        }
        description={
          currentUnit?.description ? getAttr(currentUnit?.description, language) : undefined
        }
        image={currentUnit?.picture_url}
        className={isExpanded ? "unit-container expanded" : "unit-container"}
        style={
          {
            "--header-height": `${headerHeight}px`,
            "--footer-height": `${footerHeight}px`,
          } as React.CSSProperties
        }
      >
        <Header unit={currentUnit} services={services} isLoading={isUnitLoading} />
        <SingleUnitBody
          currentUnit={currentUnit}
          isLoading={isUnitLoading}
          liveTemperatureObservation={liveTemperatureObservation}
          routeUrl={routeUrl}
          temperatureObservation={temperatureObservation}
          liveWaterQualityObservation={liveWaterQualityObservation}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      </Page>
      <MobileFooter
        onFooterHeightChange={setFooterHeight}
        toggleExpand={toggleIsExpanded}
        isExpanded={isExpanded}
      />
    </>
  );
}

export default UnitDetails;
