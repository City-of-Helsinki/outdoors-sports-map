import L from "leaflet";
import * as GeometryUtil from "leaflet-geometryutil";
import { union } from "lodash";
import get from "lodash/get";
import has from "lodash/has";
import head from "lodash/head";
import keys from "lodash/keys";
import mapValues from "lodash/mapValues";
import sortBy from "lodash/sortBy";
import upperFirst from "lodash/upperFirst";
import values from "lodash/values";
import moment from "moment";

import { getToday, isOnSeason } from "./seasons";
import {
  DEFAULT_STATUS_FILTER,
  QualityEnum,
  Seasons,
  UNIT_HANDLE_HEIGHT,
  UNIT_PIN_HEIGHT,
  UnitFilters,
  UnitQuality,
  Unit,
  SportFilter,
  StatusFilter,
  SportFilters,
  SeasonDelimiter,
  UnitConnection,
  SkiingFilter,
  SkiingFilters,
  UnitAutomaticConditionChangeDays,
  UnitConnectionTags,
  UnitQualityConst,
  HikingFilter,
} from "./unitConstants";
import { createRequest, createUrl } from "../api/apiHelpers";
import { AppState, DEFAULT_LANG } from "../app/appConstants";
import i18n from "../i18n/i18n";
import {
  IceSkatingServices,
  SkiingServices,
  SwimmingServices,
  UnitServices,
  IceSwimmingServices,
  SupportingServices,
  SleddingServices,
} from "../service/serviceConstants";
import { getOnSeasonServices } from "../service/serviceHelpers";

export const getFetchUnitsRequest = (params: Record<string, any>) =>
  createRequest(
    createUrl("unit/", {
      service: getOnSeasonServices().join(","),
      only: "id,name,location,street_address,address_zip,extensions,services,municipality,phone,www,description,picture_url,extra",
      include: "observations,connections",
      geometry: "true",
      geometry_3d: "true",
      page_size: 1000,
      ...params,
    }),
  );

export const getAttr = (
  attr: Record<string, any>,
  lang: string = DEFAULT_LANG,
) => {
  let translated = has(attr, lang) && attr[lang];

  if (!translated) {
    for (let i = 0; i < keys(attr).length; ++i) {
      translated = attr[keys(attr)[i]];

      if (translated) {
        break;
      }
    }
  }

  return translated || null;
};

export const getUnitPosition = (unit: Unit): [number, number] | undefined => {
  // If the unit doesn't have set location but has a geometry, eg. ski track,
  // use the first point in the geometry.
  if (
    !unit.location &&
    unit.geometry.type === "MultiLineString" &&
    unit.geometry.coordinates
  ) {
    const [long, lat] = unit.geometry.coordinates[0][0];

    return [lat, long];
  }

  if (unit?.location?.coordinates) {
    const [long, lat] = unit.location.coordinates;

    return [lat, long];
  }
};

export const createReittiopasUrl = (unit: Unit, lang: string) => {
  const lat = get(unit, "location.coordinates[1]");
  const lon = get(unit, "location.coordinates[0]");
  const origin = " "; // sic
  const street = getAttr(unit.street_address, lang);
  const municipality = unit.municipality || "";
  const coordinates = lat && lon ? encodeURIComponent(`::${lat},${lon}`) : "";

  const to = encodeURIComponent(
    `${upperFirst(street)}, ${upperFirst(municipality)}${coordinates}`,
  );

  const from = encodeURIComponent(origin);
  const url = `https://reittiopas.hsl.fi/reitti/${from}/${to}`;

  return url;
};

export const createPalvelukarttaUrl = (unit: Unit, lang: string) =>
  `https://palvelukartta.hel.fi/${lang}/unit/${unit.id}`;

export const getUnitSport = (unit: Unit) => {
  if (unit.services && unit.services.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const service of unit.services) {
      if (IceSkatingServices.includes(service)) {
        return UnitFilters.ICE_SKATING;
      }

      if (SkiingServices.includes(service)) {
        return UnitFilters.SKIING;
      }

      if (SwimmingServices.includes(service)) {
        return UnitFilters.SWIMMING;
      }

      if (IceSwimmingServices.includes(service)) {
        return UnitFilters.ICE_SWIMMING;
      }
      if (SleddingServices.includes(service)) {
        return UnitFilters.SLEDDING;
      }
      if (SupportingServices.includes(service)) {
        switch (service) {
          case UnitServices.COOKING_FACILITY:
            return UnitFilters.COOKING_FACILITY;

          case UnitServices.CAMPING:
            return UnitFilters.CAMPING;

          case UnitServices.SKI_LODGE:
            return UnitFilters.SKI_LODGE;

          case UnitServices.INFORMATION_POINT:
            return UnitFilters.INFORMATION_POINT;

          case UnitServices.LEAN_TO:
            return UnitFilters.LEAN_TO;

          default:
            return "unknown";
        }
      }
    }
  }

  return "unknown";
};

export const getObservation = (unit: Unit, matchProperty: string) => {
  const { observations } = unit;

  return observations
    ? observations.find((obs) => obs.property.includes(matchProperty))
    : null;
};

export const getCondition = (unit: Unit) => {
  const { observations } = unit;

  return observations ? observations.find((obs) => obs.primary) : null;
};

export const getUnitQuality = (unit: Unit): string => {
  const observation = getCondition(unit);

  return observation ? observation.quality : UnitQuality.UNKNOWN;
};

export const getOpeningHours = (unit: Unit, activeLang: string): string[] => {
  const isMechanicallyFrozenIce = unit.services.includes(
    UnitServices.MECHANICALLY_FROZEN_ICE,
  );

  if (!isMechanicallyFrozenIce) {
    return [];
  }

  const connections = unit.connections || [];

  return connections
    .filter((connection) => connection.section_type === "OPENING_HOURS")
    .map((connection) => getAttr(connection.name, activeLang) || "")
    .filter((result) => result !== "");
};

export const getObservationTime = (observation: Record<string, any>) =>
  moment((observation && observation.time) || 0).toDate();

export const enumerableQuality = (quality: string): number =>
  QualityEnum[quality] ? QualityEnum[quality] : Number.MAX_VALUE;

export const getConnectionByTag = (
  unit: Unit,
  tag: string,
): UnitConnection | undefined => {
  return unit.connections.find(
    (connection) => connection.tags && connection.tags.includes(tag),
  );
};

/**
 * ICONS
 */
export const getUnitIconURL = (
  unit: Unit,
  selected: boolean | null | undefined = false,
  retina: boolean | null | undefined = true,
) => {
  const quality = getUnitQuality(unit);
  const sport = getUnitSport(unit);
  const onOff = selected ? "on" : "off";
  const resolution = retina ? "@2x" : "";

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(
    `../assets/markers/${sport}-${quality}-${onOff}${resolution}.png`,
  ).default;
};

export const getUnitIconHeight = (unit: Unit) =>
  getUnitSport(unit) === UnitFilters.SKIING
    ? UNIT_HANDLE_HEIGHT
    : UNIT_PIN_HEIGHT;

export const getUnitIcon = (
  unit: Unit,
  selected: boolean | null | undefined = false,
) => ({
  url: getUnitIconURL(unit, selected, false),
  retinaUrl: getUnitIconURL(unit, selected, true),
  height: getUnitIconHeight(unit),
});

export const getFilterIconURL = (
  filter: string, // eslint-disable-next-line global-require, import/no-dynamic-require
) =>
  filter ? require(`../assets/icons/icon-white-${filter}@2x.png`).default : "";

/**
 * FILTERZ
 */
export const getOnSeasonSportFilters = (
  date: SeasonDelimiter = getToday(),
): SportFilter[] =>
  Seasons.filter((season) => isOnSeason(date, season))
    .map(({ filters }) => filters)
    .reduce((flattened, filters) => [...flattened, ...filters], []);

export const getOffSeasonSportFilters = (
  date: SeasonDelimiter = getToday(),
): Array<string> =>
  Seasons.filter((season) => !isOnSeason(date, season))
    .map(({ filters }) => filters)
    .reduce((flattened, filters) => [...flattened, ...filters], []);

export const getSportFilters = (date: SeasonDelimiter = getToday()) => ({
  onSeason: getOnSeasonSportFilters(date),
  offSeason: getOffSeasonSportFilters(date),
});

export const getDefaultSportFilter = (): SportFilter =>
  head(getOnSeasonSportFilters(getToday())) || SportFilters[0];

export const getDefaultStatusFilter = (): StatusFilter => DEFAULT_STATUS_FILTER;

export const getDefaultFilters = () => ({
  status: getDefaultStatusFilter(),
  sport: getDefaultSportFilter(),
});

export const getOnSeasonHikeFilters = (
  date: SeasonDelimiter = getToday(),
): HikingFilter[] =>
  Seasons.filter((season) => isOnSeason(date, season))
    .map(({ hikeFilters }) => hikeFilters)
    .reduce((flattened, filters) => [...flattened, ...filters], []);

export const getSportSpecificationFilters = (
  sport: SportFilter,
): SkiingFilter[] | HikingFilter[] => {
  if (sport === UnitFilters.SKIING) {
    return [...SkiingFilters];
  }

  if (sport === UnitFilters.HIKING) {
    const seasonHikeFilters = getOnSeasonHikeFilters();
    return seasonHikeFilters;
  }
  return [];
};

/**
 * SORT UNIT LIST
 */
const _sortByDistance = (
  units: Unit[],
  position: [number, number],
  leafletMap: L.Map,
) => {
  if (leafletMap === null) {
    return units;
  }

  const positionLatLng = new L.LatLng(...position);

  return sortBy(units, (unit) => {
    if (
      unit.geometry === null ||
      unit.geometry === undefined ||
      unit.geometry.type === "Point"
    ) {
      if (unit.location === null || unit.location === undefined) {
        return 0;
      }

      return positionLatLng.distanceTo(
        L.GeoJSON.coordsToLatLng(unit.location.coordinates),
      );
    }

    if (unit.geometry.type === "MultiLineString") {
      const latLngs = L.GeoJSON.coordsToLatLngs(unit.geometry.coordinates, 1);

      const closestLatLng = GeometryUtil.closest(
        leafletMap,
        latLngs,
        positionLatLng,
      );

      return positionLatLng.distanceTo(closestLatLng);
    }
  });
};

export const sortByDistance = _sortByDistance;

export const sortByName = (units: Unit[], lang?: string) =>
  sortBy(units, (unit) => getAttr(unit.name, lang));

export const sortByCondition = (units: Unit[]) =>
  sortBy(units, [
    (unit) => enumerableQuality(getUnitQuality(unit)),
    (unit) => {
      const observation = getCondition(unit);

      const observationTime =
        (observation &&
          observation.time &&
          new Date(observation.time).getTime()) ||
        0;

      return new Date().getTime() - observationTime;
    },
  ]);

export const sortByFavorites = (units: Unit[]): Unit[] => {
  const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
  return units.filter((unit) =>
    favourites.some((favourite: Unit) => favourite.id === unit.id),
  );
};

export const getAddressToDisplay = (
  address: Record<string, any>,
  activeLang: string,
) =>
  Object.keys(address).length !== 0
    ? `${String(getAttr(address.street.name, activeLang))} ${
        address.number
      }, ${upperFirst(address.street.municipality)}`
    : null;

export const getAllSportServices = () => {
  return values(UnitServices).join(",");
};

export const getOnSeasonSportServices = () => {
  const sportFilters = getOnSeasonSportFilters();
  if (
    sportFilters &&
    sportFilters[0] &&
    sportFilters[0] === UnitFilters.SWIMMING
  ) {
    return SwimmingServices.join(",");
  } else if (
    sportFilters &&
    sportFilters[0] &&
    sportFilters[0] === UnitFilters.ICE_SWIMMING
  ) {
    return IceSwimmingServices.join(",");
  } else {
    return SkiingServices.concat(IceSkatingServices).join(",");
  }
};

export const getNoneHikingUnit = (
  visibleUnits: string[],
  stateUnits: AppState["unit"],
): string[] => {
  // Create array from all the unit objects.
  const visibleUnitObjects: Unit[] = Object.assign(
    [],
    Object.values(stateUnits.byId).filter((u) =>
      visibleUnits.includes(u.id.toString()),
    ),
  );

  return visibleUnitObjects
    .filter((u) => {
      const containsService = u.services.some((item) =>
        SupportingServices.includes(item),
      );
      return !containsService ? u : null;
    })
    .map((u) => u.id.toString());
};

export const getFilteredUnitsBySportSpecification = (
  visibleUnits: string[],
  stateUnits: AppState["unit"],
  sportSpecification: string,
): string[] => {
  // If nothing to filter
  if (!sportSpecification) return visibleUnits;

  // Create array from all the unit objects.
  // Only show the ones that have already been filtered
  const visibleUnitObjects: Unit[] = Object.assign(
    [],
    Object.values(stateUnits.byId).filter((u) =>
      visibleUnits.includes(u.id.toString()),
    ),
  );

  const hasFreestyleFilter: boolean = sportSpecification.includes(
    UnitFilters.SKIING_FREESTYLE,
  );
  const hasTraditionalFilter: boolean = sportSpecification.includes(
    UnitFilters.SKIING_TRADITIONAL,
  );
  const hasDogSkijoringFilter: boolean = sportSpecification.includes(
    UnitFilters.SKIING_DOG_SKIJORING_TRACK,
  );
  const hasLeanToFilter: boolean = sportSpecification.includes(
    UnitFilters.LEAN_TO,
  );
  const hasCookingFilter: boolean = sportSpecification.includes(
    UnitFilters.COOKING_FACILITY,
  );
  const hasCampingFilter: boolean = sportSpecification.includes(
    UnitFilters.CAMPING,
  );
  const hasInfoPointFilter: boolean = sportSpecification.includes(
    UnitFilters.INFORMATION_POINT,
  );
  const hasSkiLodgeFilter: boolean = sportSpecification.includes(
    UnitFilters.SKI_LODGE,
  );
  const skiTrackFreestyleUnits = (): string[] => {
    if (!hasFreestyleFilter) return [];

    // Get list of unit IDs where lipas.skiTrackFreestyle is set to 1
    return visibleUnitObjects
      .filter((u) => {
        return get(u, ["extra", "lipas.skiTrackFreestyle"], null) ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const skiTrackTraditionalUnits = (): string[] => {
    if (!hasTraditionalFilter) return [];

    // Get list of unit IDs where lipas.skiTrackTraditional is set to 1
    return visibleUnitObjects
      .filter((u) => {
        return get(u, ["extra", "lipas.skiTrackTraditional"], null) ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const skiTrackDogSkijoring = (): string[] => {
    if (!hasDogSkijoringFilter) return [];

    // Get list of unit IDs where DOG_SKIJORING_TRACK connection tag is present
    return visibleUnitObjects
      .filter((u) => {
        const connectionsWithDogSkijoring = u.connections.filter((c) =>
          c.tags.includes(UnitConnectionTags.DOG_SKIJORING_TRACK),
        );
        return !!connectionsWithDogSkijoring.length ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const leanToUnits = (): string[] => {
    if (!hasLeanToFilter) return [];

    // Get list of unit IDs where services includes LeanTo service ids
    return visibleUnitObjects
      .filter((u) => {
        const containsService = u.services.includes(UnitServices.LEAN_TO);
        return containsService ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const CookingFacilityUnits = (): string[] => {
    if (!hasCookingFilter) return [];

    // Get list of unit IDs where services includes cooking facility service ids
    return visibleUnitObjects
      .filter((u) => {
        const containsService = u.services.includes(
          UnitServices.COOKING_FACILITY,
        );
        return containsService ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const CampingUnits = (): string[] => {
    if (!hasCampingFilter) return [];

    // Get list of unit IDs where services includes camping service ids
    return visibleUnitObjects
      .filter((u) => {
        const containsService = u.services.includes(UnitServices.CAMPING);
        return containsService ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const InformationPointUnits = (): string[] => {
    if (!hasInfoPointFilter) return [];

    // Get list of unit IDs where services includes information point service ids
    return visibleUnitObjects
      .filter((u) => {
        const containsService = u.services.includes(
          UnitServices.INFORMATION_POINT,
        );
        return containsService ? u : null;
      })
      .map((u) => u.id.toString());
  };

  const SkiLodgeUnits = (): string[] => {
    if (!hasSkiLodgeFilter) return [];

    // Get list of unit IDs where services includes ski lodge service ids
    return visibleUnitObjects
      .filter((u) => {
        const containsService = u.services.includes(UnitServices.SKI_LODGE);
        return containsService ? u : null;
      })
      .map((u) => u.id.toString());
  };
  // merge arrays into one and remove duplicate items from it
  const filteredUnits: string[] = union(
    skiTrackFreestyleUnits(),
    skiTrackTraditionalUnits(),
    skiTrackDogSkijoring(),
    leanToUnits(),
    CookingFacilityUnits(),
    CampingUnits(),
    InformationPointUnits(),
    SkiLodgeUnits(),
  );

  return filteredUnits;
};

const handleSingleUnitConditionUpdate = (unit: Unit) => {
  const sport = getUnitSport(unit);
  const filters = [
    UnitFilters.COOKING_FACILITY,
    UnitFilters.CAMPING,
    UnitFilters.LEAN_TO,
    UnitFilters.INFORMATION_POINT,
    UnitFilters.SKI_LODGE,
    UnitFilters.ICE_SWIMMING,
  ] as string[];

  if (filters.includes(sport)) {
    const defaultObservations = [getDefaultUnitObservation(unit)];
    unit.observations = defaultObservations;
  }

  const { observations } = unit;

  // Get latest primary observation
  const primaryObservation = observations.find((obs) => obs.primary) || null;

  const today = moment();
  const lastObservation = moment(primaryObservation?.time);
  const daysFromLastUpdate = today.diff(lastObservation, "d");

  const getMinimumDaysToHandleConditionUpdates = (): number => {
    if (sport === "unknown") return 0;

    // Get satisfactory and unknown days based on sport
    const satisfactoryDays =
      UnitAutomaticConditionChangeDays[sport].satisfactory;
    const unknownDays = UnitAutomaticConditionChangeDays[sport].unknown;

    // Use satisfactory days if it exists
    if (satisfactoryDays !== undefined) {
      return satisfactoryDays;
    }

    return unknownDays;
  };

  // Don't do anything if:
  // Unit has been recently updated, OR
  // Unit is marked as "closed" OR
  // There's no primary observation available
  if (
    daysFromLastUpdate < getMinimumDaysToHandleConditionUpdates() ||
    primaryObservation?.value === "closed" ||
    !primaryObservation
  ) {
    return unit;
  }

  // Unknown
  // A copy of last primary observation,
  // where name and quality values are altered
  const unknownObservation = {
    ...primaryObservation,
    name: {
      fi: i18n.t("UNIT_DETAILS.UNKNOWN", { lng: "fi" }),
      sv: i18n.t("UNIT_DETAILS.UNKNOWN", { lng: "sv" }),
      en: i18n.t("UNIT_DETAILS.UNKNOWN", { lng: "en" }),
    },
    quality: UnitQualityConst.UNKNOWN,
  };

  // Satisfactory
  // A copy of last primary observation,
  // where name and quality values are altered
  const satisfactoryObservation = {
    ...primaryObservation,
    name: {
      fi: i18n.t("UNIT_DETAILS.SATISFACTORY", { lng: "fi" }),
      sv: i18n.t("UNIT_DETAILS.SATISFACTORY", { lng: "sv" }),
      en: i18n.t("UNIT_DETAILS.SATISFACTORY", { lng: "en" }),
    },
    quality: UnitQualityConst.SATISFACTORY,
  };

  // If a sport has satisfactory and unknown conditions, check if we need to use
  // satisfactory value for it (which should be a smaller number than unknown)
  const isSatisfactory: boolean =
    sport !== "unknown" &&
    daysFromLastUpdate < UnitAutomaticConditionChangeDays[sport].unknown;

  // Set new observation copy as the first observation in unit's observations list
  if (isSatisfactory) {
    unit.observations = [satisfactoryObservation, ...observations];
  } else {
    unit.observations = [unknownObservation, ...observations];
  }

  return unit;
};

export const handleUnitConditionUpdates = (units: Record<number, Unit>) => {
  return mapValues(units, (unit) => handleSingleUnitConditionUpdate(unit));
};

export const getDefaultUnitObservation = (unit: Unit) => {
  const sport = getUnitSport(unit);
  const observation = {
    primary: true,
    unit: unit.id,
    time: new Date().toISOString(),
    expiration_time: null,
    quality: UnitQualityConst.GOOD,
    value: UnitQualityConst.GOOD,
    id: 1400000 + Math.floor(Math.random() * 100000),
    property: [`${sport}_condition`],
    name: {
      fi: i18n.t("UNIT_DETAILS.SERVICE_CONDITION.DEFAULT", { lng: "fi" }),
      sv: i18n.t("UNIT_DETAILS.SERVICE_CONDITION.DEFAULT", { lng: "sv" }),
      en: i18n.t("UNIT_DETAILS.SERVICE_CONDITION.DEFAULT", { lng: "en" }),
    },
  };
  return observation;
};
