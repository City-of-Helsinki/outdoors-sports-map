import { APP_NAME, QueryValue } from "./app/appConstants";

export const normalizeActionName = (name: string): string =>
  `${APP_NAME || ""}/${name}`;

export const arrayifyQueryValue = (queryValue: QueryValue): Array<string> => {
  // Handle undefined
  if (typeof queryValue === "undefined") {
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
  window.devicePixelRatio > 1 ||
  (window.matchMedia &&
    window.matchMedia(
      "(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)",
    ).matches);
