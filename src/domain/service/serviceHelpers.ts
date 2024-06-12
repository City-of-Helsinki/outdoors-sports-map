import isEmpty from "lodash/isEmpty";

import { DEFAULT_LANG } from "../app/appConstants";
import { getToday, isOnSeason } from "../unit/seasons";
import { SeasonDelimiter, Seasons } from "../unit/unitConstants";
import { getAttr } from "../unit/unitHelpers";

const getServiceName = (
  unitServices: number[],
  services: Record<string, any>,
  language: string = DEFAULT_LANG,
) => {
  if (!services || isEmpty(services)) {
    return "";
  }

  // eslint-disable-next-line no-restricted-syntax
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
): Number[] => {
  return Seasons.filter((season) => isOnSeason(date, season))
    .map(({ services }) => services)
    .reduce((flattened, services) => [...flattened, ...services], []);
};

export default getServiceName;
