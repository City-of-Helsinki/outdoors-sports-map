import isEmpty from "lodash/isEmpty";

import { 
  IceSkatingServices,
  IceSwimmingServices,
  SkiingServices,
  SleddingServices,
  SwimmingServices,
  SupportingServices,
} from "./serviceConstants";
import { Service } from "./state/serviceSlice";
import { DEFAULT_LANG } from "../app/appConstants";
import { getToday, isOnSeason } from "../unit/seasons";
import { SportFilter, HikingFilter, SeasonDelimiter } from "../unit/types";
import { UnitFilters, Seasons } from "../unit/unitConstants";
import { getAttr } from "../unit/unitHelpers";

const getServiceName = (
  unitServices: number[],
  services: Record<string, Service>,
  language: string = DEFAULT_LANG,
) => {
  if (!services || isEmpty(services)) {
    return "";
  }

  for (const id of unitServices) {
    const service = services[id];

    if (service?.name !== undefined) {
      return getAttr(services[id].name, language);
    }
  }

  return "";
};

export const getOnSeasonServices = (
  date: SeasonDelimiter = getToday(),
): number[] => {
  return Seasons.filter((season) => isOnSeason(date, season))
    .flatMap((season) => season.services);
};

export const getOnSeasonSportFilters = (
  date: SeasonDelimiter = getToday(),
): SportFilter[] => {
  return Seasons.filter((season) => isOnSeason(date, season))
    .flatMap((season) => season.filters);
};

export const getOnSeasonHikeFilters = (
  date: SeasonDelimiter = getToday(),
): HikingFilter[] => {
  return Seasons.filter((season) => isOnSeason(date, season))
    .flatMap((season) => season.hikeFilters);
};

// Get services for a specific sport filter
export const getServicesForSport = (sport: SportFilter): number[] => {
  switch (sport) {
    case UnitFilters.SKIING:
      return SkiingServices;
    case UnitFilters.ICE_SKATING:
      return IceSkatingServices;
    case UnitFilters.SWIMMING:
      return SwimmingServices;
    case UnitFilters.ICE_SWIMMING:
      return IceSwimmingServices;
    case UnitFilters.SLEDDING:
      return SleddingServices;
    case UnitFilters.HIKING:
      return SupportingServices;
    default:
      return [];
  }
};

// Get all services grouped by sport type
export const getServicesBySport = (): Record<SportFilter, number[]> => {
  return {
    [UnitFilters.SKIING]: SkiingServices,
    [UnitFilters.ICE_SKATING]: IceSkatingServices,
    [UnitFilters.SWIMMING]: SwimmingServices,
    [UnitFilters.ICE_SWIMMING]: IceSwimmingServices,
    [UnitFilters.SLEDDING]: SleddingServices,
    [UnitFilters.HIKING]: SupportingServices,
  };
};

export default getServiceName;
