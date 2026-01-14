import isEmpty from "lodash/isEmpty";

import { Service } from "./serviceSlice";
import { DEFAULT_LANG } from "../app/appConstants";
import { getToday, isOnSeason } from "../unit/seasons";
import { SeasonDelimiter, Seasons } from "../unit/unitConstants";
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

    if (service && typeof service.name !== "undefined") {
      return getAttr(services[id].name, language);
    }
  }

  return "";
};

export const getOnSeasonServices = (
  date: SeasonDelimiter = getToday(),
): number[] => {
  return Seasons.filter((season) => isOnSeason(date, season))
    .map(({ services }) => services)
    .reduce((flattened, services) => [...flattened, ...services], []);
};

export default getServiceName;
