import { LatLngBoundsLiteral } from "leaflet";

import { normalizeActionName } from "../utils";

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
