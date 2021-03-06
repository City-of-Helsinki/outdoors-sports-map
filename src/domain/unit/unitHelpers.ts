import L from "leaflet";
import * as GeometryUtil from "leaflet-geometryutil";
import get from "lodash/get";
import has from "lodash/has";
import head from "lodash/head";
import keys from "lodash/keys";
import sortBy from "lodash/sortBy";
import upperFirst from "lodash/upperFirst";
import values from "lodash/values";
import moment from "moment";

import { createRequest, createUrl } from "../api/apiHelpers";
import { DEFAULT_LANG } from "../app/appConstants";
import {
  IceSkatingServices,
  SkiingServices,
  SwimmingServices,
  UnitServices,
} from "../service/serviceConstants";
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
} from "./unitConstants";

export const getFetchUnitsRequest = (params: Record<string, any>) =>
  createRequest(
    createUrl("unit/", {
      service: `${values(UnitServices).join(",")}`,
      only:
        "id,name,location,street_address,address_zip,extensions,services,municipality,phone,www,description,picture_url",
      include: "observations,connections",
      geometry: "true",
      page_size: 1000,
      ...params,
    })
  );

export const getAttr = (
  attr: Record<string, any>,
  lang: string = DEFAULT_LANG
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
    `${upperFirst(street)}, ${upperFirst(municipality)}${coordinates}`
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
    UnitServices.MECHANICALLY_FROZEN_ICE
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

/**
 * ICONS
 */
export const getUnitIconURL = (
  unit: Unit,
  selected: boolean | null | undefined = false,
  retina: boolean | null | undefined = true
) => {
  const quality = getUnitQuality(unit);
  const sport = getUnitSport(unit);
  const onOff = selected ? "on" : "off";
  const resolution = retina ? "@2x" : "";

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`../assets/markers/${sport}-${quality}-${onOff}${resolution}.png`)
    .default;
};

export const getUnitIconHeight = (unit: Unit) =>
  getUnitSport(unit) === UnitFilters.SKIING
    ? UNIT_HANDLE_HEIGHT
    : UNIT_PIN_HEIGHT;

export const getUnitIcon = (
  unit: Unit,
  selected: boolean | null | undefined = false
) => ({
  url: getUnitIconURL(unit, selected, false),
  retinaUrl: getUnitIconURL(unit, selected, true),
  height: getUnitIconHeight(unit),
});

export const getFilterIconURL = (
  filter: string // eslint-disable-next-line global-require, import/no-dynamic-require
) =>
  filter ? require(`../assets/icons/icon-white-${filter}@2x.png`).default : "";

/**
 * FILTERZ
 */
export const getOnSeasonSportFilters = (
  date: SeasonDelimiter = getToday()
): SportFilter[] =>
  Seasons.filter((season) => isOnSeason(date, season))
    .map(({ filters }) => filters)
    .reduce((flattened, filters) => [...flattened, ...filters], []);

export const getOffSeasonSportFilters = (
  date: SeasonDelimiter = getToday()
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

/**
 * SORT UNIT LIST
 */
const _sortByDistance = (
  units: Unit[],
  position: [number, number],
  leafletMap: L.Map
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
        L.GeoJSON.coordsToLatLng(unit.location.coordinates)
      );
    }

    if (unit.geometry.type === "MultiLineString") {
      const latLngs = L.GeoJSON.coordsToLatLngs(unit.geometry.coordinates, 1);

      const closestLatLng = GeometryUtil.closest(
        leafletMap,
        latLngs,
        positionLatLng
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

export const getAddressToDisplay = (
  address: Record<string, any>,
  activeLang: string
) =>
  Object.keys(address).length !== 0
    ? `${String(getAttr(address.street.name, activeLang))} ${
        address.number
      }, ${upperFirst(address.street.municipality)}`
    : null;
