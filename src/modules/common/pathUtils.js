// @flow

import type { BrowserLocation } from 'history';

function shouldAddSlash(pathname?: string): boolean {
  if (!pathname) {
    return false;
  }

  return pathname.slice(0, 1) !== '/';
}

function buildPathname(...parts: string[]) {
  return parts.reduce((acc, part) => {
    const addSlash = shouldAddSlash(part);

    return `${acc}${addSlash ? '/' : ''}${part}`;
  }, '');
}

export function getPathnameWithLanguage(path: string, lang: string): string {
  return buildPathname(lang, path);
}

export function getLocationWithLanguage(
  location: $Shape<BrowserLocation>,
  lang: string
): $Shape<BrowserLocation> {
  const { pathname } = location;

  return {
    ...location,
    pathname: pathname ? buildPathname(lang, pathname) : pathname,
  };
}

export function getLocationFactoryWithLanguage(
  locationFactory: (location: BrowserLocation) => $Shape<BrowserLocation>,
  lang: string
) {
  return ({ pathname, ...rest }: BrowserLocation): $Shape<BrowserLocation> =>
    locationFactory({
      ...rest,
      pathname: buildPathname(lang, pathname),
    });
}

export function replaceLanguageInPath(pathname: string, language: string) {
  const nextPathname = pathname.split('/');
  // Replace language that's at the root index in the path
  nextPathname.splice(1, 1, language);

  return nextPathname.join('/');
}
