import { LatLngBoundsLiteral } from "leaflet";

import { normalizeActionName } from "../utils";

export const MAP_URL = {
  fi: "https://tiles.hel.ninja/styles/hel-osm-light/{z}/{x}/{y}.png",
  sv: "https://tiles.hel.ninja/styles/hel-osm-light/{z}/{x}/{y}@sv.png",
  en: "https://tiles.hel.ninja/styles/hel-osm-light/{z}/{x}/{y}@en.png",
};

export const MAP_RETINA_URL = {
  fi: MAP_URL.fi.replace(".png", "@3x.png"),
  sv: MAP_URL.sv.replace("@sv", "@3x@sv"),
  en: MAP_URL.en.replace("@en", "@3x@en"),
};

export const DEFAULT_ZOOM = 12;

export const MIN_ZOOM = 10;

export const MAX_ZOOM = 18;

export const DETAIL_ZOOM_IN = 15;

export const BOUNDARIES: LatLngBoundsLiteral = [
  [59.4, 23.8],
  [61.5, 25.8],
];

export const mapActions = {
  SET_LOCATION: normalizeActionName("map/SET_LOCATION"),
  RECEIVE_ADDRESS: normalizeActionName("map/RECEIVE_ADDRESS"),
};
