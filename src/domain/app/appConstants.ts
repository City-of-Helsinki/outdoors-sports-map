import { getEnvValue } from '../../common/utils/envUtils';

export const API_BASE_URL = getEnvValue('REACT_APP_API_URL') ?? '';

export const MAP_URL_TEMPLATE = getEnvValue('REACT_APP_MAP_URL_TEMPLATE') ?? '';

export const DIGITRANSIT_API_BASE_URL = '/api/digitransit';

export const APP_NAME = getEnvValue('REACT_APP_APP_NAME') ?? '';

export const BYPASS_SEASON_FILTER = getEnvValue('REACT_APP_BYPASS_SEASON_FILTER') === "true";

export const DEFAULT_LANG = "fi";

export const mobileBreakpoint = 768;
