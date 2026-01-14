export function getCanonicalUrl(location: Location = globalThis.location) {
  return new URL(location.pathname, location.href).href;
}
