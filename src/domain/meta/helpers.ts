export function getCanonicalUrl(
  location: Pick<Location, "href"> = globalThis.location,
) {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";

  return url.href;
}
