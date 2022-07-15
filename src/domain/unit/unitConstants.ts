import { Geometry } from "geojson";
import { NormalizedSchema, schema } from "normalizr";

import { normalizeActionName } from "../utils";

export const UNIT_PIN_HEIGHT = 40;

export const UNIT_HANDLE_HEIGHT = 32;

export const UNIT_ICON_WIDTH = 32;

export const UnitFilters = {
  SKIING: "ski",
  ICE_SKATING: "iceskate",
  SWIMMING: "swim",
  STATUS_OK: "status_ok",
  STATUS_ALL: "status_all",
} as const;

export type UnitFilterValues = typeof UnitFilters[keyof typeof UnitFilters];

export const StatusFilters = [
  UnitFilters.STATUS_ALL,
  UnitFilters.STATUS_OK,
] as const;

export type StatusFilter = typeof StatusFilters[number];

export const SportFilters = [
  UnitFilters.SKIING,
  UnitFilters.ICE_SKATING,
  UnitFilters.SWIMMING,
] as const;

export type SportFilter = typeof SportFilters[number];

type Translatable<T = string> = {
  fi: T;
  sv: T;
  en: T;
};

export const UnitConnectionTags = {
  CONTROL: "#valvonta",
  HEATING: "#lämmitys",
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
    value: Translatable<string>;
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
  filters: [UnitFilters.SKIING, UnitFilters.ICE_SKATING],
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
} as const;

export type SortKey = typeof SortKeys[keyof typeof SortKeys];

export const UNIT_BATCH_SIZE = 20;

export const DEFAULT_STATUS_FILTER = UnitFilters.STATUS_ALL;

export const UnitQuality = {
  GOOD: "good",
  SATISFACTORY: "satisfactory",
  UNUSABLE: "unusable",
  UNKNOWN: "unknown",
};

export const QualityEnum = {
  [UnitQuality.GOOD]: 1,
  [UnitQuality.SATISFACTORY]: 2,
  [UnitQuality.UNUSABLE]: 3,
  [UnitQuality.UNKNOWN]: 4,
};

export const UnitActions = {
  FETCH: normalizeActionName("unit/FETCH"),
  RECEIVE: normalizeActionName("unit/RECEIVE"),
  FETCH_ERROR: normalizeActionName("unit/FETCH_ERROR"),
  SEARCH_CLEAR: normalizeActionName("unit/SEARCH_CLEAR"),
  SEARCH_REQUEST: normalizeActionName("unit/SEARCH_REQUEST"),
  SEARCH_RECEIVE: normalizeActionName("unit/SEARCH_RECEIVE"),
  FETCH_SEARCH_SUGGESTIONS: normalizeActionName(
    "unit/FETCH_SEARCH_SUGGESTIONS"
  ),
  RECEIVE_SEARCH_SUGGESTIONS: normalizeActionName(
    "unit/RECEIVE_SEARCH_SUGGESTIONS"
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
    "unit/search/FETCH_UNIT_SUGGESTIONS"
  ),
  RECEIVE_UNIT_SUGGESTIONS: normalizeActionName(
    "unit/search/RECEIVE_UNIT_SUGGESTIONS"
  ),
  RECEIVE_ADDRESS_SUGGESTIONS: normalizeActionName(
    "unit/search/RECEIVE_ADDRESS_SUGGESTIONS"
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
