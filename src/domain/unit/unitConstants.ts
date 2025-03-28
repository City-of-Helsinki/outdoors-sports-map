import { Geometry, MultiLineString } from "geojson";
import { NormalizedSchema, schema } from "normalizr";

import {
  IceSkatingServices,
  SkiingServices,
  SwimmingServices,
  IceSwimmingServices,
  SummerSupportingServices,
  YearRoundSupportingServices,
  SleddingServices,
} from "../service/serviceConstants";
import { normalizeActionName } from "../utils";

export const UNIT_PIN_HEIGHT = 40;

export const UNIT_HANDLE_HEIGHT = 32;

export const UNIT_ICON_WIDTH = 32;

export const UnitFilters = {
  SKIING: "ski",
  SKIING_FREESTYLE: "freestyle",
  SKIING_TRADITIONAL: "traditional",
  SKIING_DOG_SKIJORING_TRACK: "dog_skijoring_track",
  ICE_SKATING: "iceskate",
  SWIMMING: "swim",
  ICE_SWIMMING: "iceswim",
  STATUS_OK: "status_ok",
  STATUS_ALL: "status_all",
  HIKING: "hike",
  LEAN_TO: "leanto",
  INFORMATION_POINT: "infopoint",
  COOKING_FACILITY: "cooking",
  CAMPING: "camping",
  SKI_LODGE: "skilodge",
  SLEDDING: "sledding",
} as const;

export type UnitFilterValues = (typeof UnitFilters)[keyof typeof UnitFilters];

export const StatusFilters = [
  UnitFilters.STATUS_ALL,
  UnitFilters.STATUS_OK,
] as const;

export type StatusFilter = (typeof StatusFilters)[number];

export const SportFilters = [
  UnitFilters.SKIING,
  UnitFilters.ICE_SKATING,
  UnitFilters.SWIMMING,
  UnitFilters.ICE_SWIMMING,
  UnitFilters.HIKING,
  UnitFilters.SLEDDING,
] as const;

export type SportFilter = (typeof SportFilters)[number];

export const SkiingFilters = [
  UnitFilters.SKIING_FREESTYLE,
  UnitFilters.SKIING_TRADITIONAL,
  UnitFilters.SKIING_DOG_SKIJORING_TRACK,
] as const;

export type SkiingFilter = (typeof SkiingFilters)[number];

export const HikingFilters = [
  UnitFilters.CAMPING,
  UnitFilters.COOKING_FACILITY,
  UnitFilters.LEAN_TO,
  UnitFilters.INFORMATION_POINT,
  UnitFilters.SKI_LODGE,
] as const;

export type HikingFilter = (typeof HikingFilters)[number];

export type Translatable<T = string> = {
  fi: T;
  sv: T;
  en: T;
};

export const UnitConnectionTags = {
  CONTROL: "#valvonta",
  HEATING: "#lämmitys",
  LIGHTED: "#valaisu",
  DRESSING_ROOM: "#pukukoppi",
  DOG_SKIJORING_TRACK: "#koiralatu",
  PARKING: "#pysäköinti",
  OTHER_SERVICES: "#muut_palvelut",
  MORE_INFO: "#lisätietoja",
} as const;

export type UnitConnection = {
  section_type: string;
  name: Translatable<string>;
  www: Translatable<string>;
  tags: Array<string>;
};

export type Unit = {
  id: string;
  name: Translatable<string>;
  description: Translatable<string>;
  extensions?: {
    lighting?: Translatable<string>;
    skiing_technique?: string;
    // This field name may misguide you
    length?: number;
  };
  phone?: string;
  url?: string;
  geometry: Geometry;
  geometry_3d?: MultiLineString;
  location: {
    coordinates: [number, number];
  };
  street_address: Translatable<string>;
  address_zip?: string;
  municipality?: string;
  services: number[];
  observations: Array<{
    property: string[];
    primary: boolean;
    quality: string;
    name: Translatable<string>;
    value: string | Translatable<string>;
    time: string;
  }>;
  www: Translatable<string>;
  connections: Array<UnitConnection>;
  picture_url?: string;
  extra: Record<string, string | number>;
};

export type NormalizedUnit = {
  unit: {
    [id: number]: NormalizedSchema<Unit, number>;
  };
};

export type NormalizedUnitSchema = NormalizedSchema<NormalizedUnit, number[]>;

export type SeasonDelimiter = {
  day: number;
  month: number; // 0-11, Jan = 0 & Dec = 11
};

export type Season = {
  start: SeasonDelimiter;
  end: SeasonDelimiter;
  filters: SportFilter[];
  services: Number[];
  hikeFilters: HikingFilter[];
};

export const SummerSeason: Season = {
  start: {
    day: 1,
    month: 4,
  },
  end: {
    day: 31,
    month: 9,
  },
  filters: [UnitFilters.SWIMMING],
  services: [...SwimmingServices, ...SummerSupportingServices],
  hikeFilters: [UnitFilters.LEAN_TO, UnitFilters.CAMPING],
};

export const WinterSeason: Season = {
  start: {
    day: 1,
    month: 10,
  },
  end: {
    day: 31,
    month: 3,
  },
  filters: [
    UnitFilters.SKIING,
    UnitFilters.ICE_SKATING,
    UnitFilters.ICE_SWIMMING,
    UnitFilters.SLEDDING,
  ],
  services: [
    ...IceSkatingServices,
    ...IceSwimmingServices,
    ...SkiingServices,
    ...SleddingServices,
  ],
  hikeFilters: [],
};

export const YearRoundSeason: Season = {
  start: {
    day: 1,
    month: 0,
  },
  end: {
    day: 31,
    month: 11,
  },
  filters: [],
  services: [...YearRoundSupportingServices],
  hikeFilters: [UnitFilters.COOKING_FACILITY, UnitFilters.SKI_LODGE],
};

export const Seasons: Array<Season> = [
  SummerSeason,
  WinterSeason,
  YearRoundSeason,
];

export const SortKeys = {
  ALPHABETICAL: "alphabetical",
  DISTANCE: "distance",
  CONDITION: "condition",
  FAVORITES: "favorites",
} as const;

export type SortKey = (typeof SortKeys)[keyof typeof SortKeys];

export const UNIT_BATCH_SIZE = 20;

export const DEFAULT_STATUS_FILTER = UnitFilters.STATUS_ALL;

export const UnitQuality = {
  GOOD: "good",
  SATISFACTORY: "satisfactory",
  UNUSABLE: "unusable",
  UNKNOWN: "unknown",
};

export const UnitQualityConst = {
  GOOD: "good",
  SATISFACTORY: "satisfactory",
  UNUSABLE: "unusable",
  UNKNOWN: "unknown",
} as const;

export const QualityEnum = {
  [UnitQuality.GOOD]: 1,
  [UnitQuality.SATISFACTORY]: 2,
  [UnitQuality.UNUSABLE]: 3,
  [UnitQuality.UNKNOWN]: 4,
};

// Number of days from the latest observation to automatically change condition
export const UnitAutomaticConditionChangeDays = {
  [UnitFilters.SKIING]: {
    [UnitQualityConst.SATISFACTORY]: 7,
    [UnitQualityConst.UNKNOWN]: 10,
  },
  [UnitFilters.SWIMMING]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.ICE_SKATING]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 10,
  },
  [UnitFilters.ICE_SWIMMING]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.COOKING_FACILITY]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.INFORMATION_POINT]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.CAMPING]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.SKI_LODGE]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.LEAN_TO]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 5,
  },
  [UnitFilters.SLEDDING]: {
    [UnitQualityConst.SATISFACTORY]: undefined,
    [UnitQualityConst.UNKNOWN]: 10,
  },
};

export const UnitActions = {
  FETCH: normalizeActionName("unit/FETCH"),
  RECEIVE: normalizeActionName("unit/RECEIVE"),
  FETCH_ERROR: normalizeActionName("unit/FETCH_ERROR"),
  SEARCH_CLEAR: normalizeActionName("unit/SEARCH_CLEAR"),
  SEARCH_REQUEST: normalizeActionName("unit/SEARCH_REQUEST"),
  SEARCH_RECEIVE: normalizeActionName("unit/SEARCH_RECEIVE"),
  FETCH_SEARCH_SUGGESTIONS: normalizeActionName(
    "unit/FETCH_SEARCH_SUGGESTIONS",
  ),
  RECEIVE_SEARCH_SUGGESTIONS: normalizeActionName(
    "unit/RECEIVE_SEARCH_SUGGESTIONS",
  ),
};

export type UnitState = {
  isFetching: boolean;
  byId: Record<string, any>;
  // Filtered arrays of ids
  all: Array<string>;
  skating: Array<string>;
  skiing: Array<string>;
  searchResults: Array<string>;
};

export const unitSchema = new schema.Entity<Unit>("unit", undefined, {
  idAttribute: (value) => value.id.toString(),
});

export const UnitSearchActions = {
  CLEAR: normalizeActionName("unit/search/CLEAR"),
  FETCH_UNITS: normalizeActionName("unit/search/FETCH_UNITS"),
  RECEIVE_UNITS: normalizeActionName("unit/search/RECEIVE_UNITS"),
  FETCH_UNIT_SUGGESTIONS: normalizeActionName(
    "unit/search/FETCH_UNIT_SUGGESTIONS",
  ),
  RECEIVE_UNIT_SUGGESTIONS: normalizeActionName(
    "unit/search/RECEIVE_UNIT_SUGGESTIONS",
  ),
  RECEIVE_ADDRESS_SUGGESTIONS: normalizeActionName(
    "unit/search/RECEIVE_ADDRESS_SUGGESTIONS",
  ),
};

export type UnitSearchState = {
  isFetching: boolean;
  isActive: boolean;
  // Filtered arrays of unit ids
  unitSuggestions: Array<string>;
  unitResults: Array<string>;
  addressSuggestions: Array<Record<string, any>>; // TODO: Filtered arrays of streets / address search
};

export const MAX_SUGGESTION_COUNT = 5;
