// eslint-disable-next-line import/prefer-default-export
export function getCanonicalUrl(location: Location = window.location) {
  return new URL(location.pathname, location.href).href;
}
