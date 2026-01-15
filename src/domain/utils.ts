import { APP_NAME } from "./app/appConstants";
import { QueryValue } from "./app/types";

export const normalizeActionName = (name: string): string =>
  `${APP_NAME || ""}/${name}`;

export const arrayifyQueryValue = (queryValue: QueryValue): Array<string> => {
  // Handle undefined
  if (queryValue === undefined) {
    return [];
  }

  // Handle single values
  if (!Array.isArray(queryValue)) {
    return [queryValue];
  }

  // It's an array
  return queryValue;
};

export const isRetina = () =>
  globalThis.devicePixelRatio > 1 ||
  globalThis.matchMedia?.(
    "(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)",
  ).matches;
