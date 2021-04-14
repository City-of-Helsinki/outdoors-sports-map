// @flow

// eslint-disable-next-line import/no-cycle
import { APP_NAME } from './constants';
import type { QueryValue } from './constants';

export const normalizeActionName = (name: string): string =>
  `${APP_NAME || ''}/${name}`;

export const arrayifyQueryValue = (queryValue: QueryValue): Array<string> => {
  // Handle undefined
  if (typeof queryValue === 'undefined') {
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
      '(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)'
    ).matches);

export function replaceLanguageInPath(pathname: string, language: string) {
  const nextPathname = pathname.split('/');
  // Replace language that's at the root index in the path
  nextPathname.splice(1, 1, language);

  return nextPathname.join('/');
}
