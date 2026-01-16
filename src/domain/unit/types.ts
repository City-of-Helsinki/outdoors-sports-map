import { Geometry, MultiLineString } from "geojson";
import { NormalizedSchema } from "normalizr";

import { UnitFilters, StatusFilters, SportFilters, SkiingFilters, HikingFilters, SortKeys } from "./unitConstants";

export type UnitFilterValues = (typeof UnitFilters)[keyof typeof UnitFilters];

export type StatusFilter = (typeof StatusFilters)[number];

export type SportFilter = (typeof SportFilters)[number];

export type SkiingFilter = (typeof SkiingFilters)[number];

export type HikingFilter = (typeof HikingFilters)[number];

export type SortKey = (typeof SortKeys)[keyof typeof SortKeys];

export type Translatable<T = string> = {
  fi: T;
  sv: T;
  en: T;
};

export type UnitConnection = {
  section_type: string;
  name: Translatable<string>;
  www: Translatable<string>;
  tags: Array<string>;
};

export type Observation = {
  property: string[];
  primary: boolean;
  quality: string;
  name: Translatable<string>;
  value: string | Translatable<string>;
  time: string;
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
  observations?: Array<Observation>;
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
  services: number[];
  hikeFilters: HikingFilter[];
};

export type UnitState = {
  isFetching: boolean;
  byId: Record<string, Unit>;
  // Filtered arrays of ids
  all: Array<string>;
  iceskate: Array<string>;
  ski: Array<string>;
  swim: Array<string>;
  iceswim: Array<string>;
  sledding: Array<string>;
  hike: Array<string>;
  status_ok: Array<string>;
  // Seasonal fallback data
  seasonalById: Record<string, Unit>;
  seasonalAll: Array<string>;
  seasonalIceskate: Array<string>;
  seasonalSki: Array<string>;
  seasonalSwim: Array<string>;
  seasonalIceswim: Array<string>;
  seasonalSledding: Array<string>;
  seasonalHike: Array<string>;
  seasonalStatusOk: Array<string>;
};

export type UnitSearchState = {
  isFetching: boolean;
  isActive: boolean;
  // Filtered arrays of unit ids
  unitSuggestions: Array<string>;
  unitResults: Array<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addressSuggestions: Array<Record<string, any>>; // TODO: Filtered arrays of streets / address search
};