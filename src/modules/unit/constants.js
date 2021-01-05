// @flow
import { schema } from 'normalizr';
// eslint-disable-next-line import/no-cycle
import { normalizeActionName } from '../common/helpers';

export const UNIT_PIN_HEIGHT = 40;
export const UNIT_HANDLE_HEIGHT = 32;
export const UNIT_ICON_WIDTH = 32;

export const UnitFilters = {
  SKIING: 'ski',
  ICE_SKATING: 'iceskate',
  SWIMMING: 'swim',
  STATUS_OK: 'status_ok',
  STATUS_ALL: 'status_all',
};

export const StatusFilters = [UnitFilters.STATUS_ALL, UnitFilters.STATUS_OK];

export const SportFilters = [
  UnitFilters.SKIING,
  UnitFilters.ICE_SKATING,
  UnitFilters.SWIMMING,
];

export type SeasonDelimiter = {
  day: number,
  month: number, // 0-11, Jan = 0 & Dec = 11
};

export type Season = {
  start: SeasonDelimiter,
  end: SeasonDelimiter,
  filters: Array<string>,
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
  ALPHABETICAL: 'alphabetical',
  DISTANCE: 'distance',
  CONDITION: 'condition',
};

export const UNIT_BATCH_SIZE = 20;

export const DEFAULT_STATUS_FILTER = UnitFilters.STATUS_ALL;

export const UnitQuality = {
  GOOD: 'good',
  SATISFACTORY: 'satisfactory',
  UNUSABLE: 'unusable',
  UNKNOWN: 'unknown',
};

export const QualityEnum = {
  [UnitQuality.GOOD]: 1,
  [UnitQuality.SATISFACTORY]: 2,
  [UnitQuality.UNUSABLE]: 3,
  [UnitQuality.UNKNOWN]: 4,
};

export const UnitActions = {
  FETCH: normalizeActionName('unit/FETCH'),
  RECEIVE: normalizeActionName('unit/RECEIVE'),
  FETCH_ERROR: normalizeActionName('unit/FETCH_ERROR'),
  SEARCH_CLEAR: normalizeActionName('unit/SEARCH_CLEAR'),
  SEARCH_REQUEST: normalizeActionName('unit/SEARCH_REQUEST'),
  SEARCH_RECEIVE: normalizeActionName('unit/SEARCH_RECEIVE'),
  FETCH_SEARCH_SUGGESTIONS: normalizeActionName(
    'unit/FETCH_SEARCH_SUGGESTIONS'
  ),
  RECEIVE_SEARCH_SUGGESTIONS: normalizeActionName(
    'unit/RECEIVE_SEARCH_SUGGESTIONS'
  ),
  SEND_FEEDBACK: normalizeActionName('unit/SEND_FEEDBACK'),
};

export type UnitState = {
  isFetching: boolean,
  byId: Object,
  // Filtered arrays of ids
  all: Array<string>,
  skating: Array<string>,
  skiing: Array<string>,
  searchResults: Array<string>,
};

export const unitSchema = new schema.Entity('unit' /* , {} */);
