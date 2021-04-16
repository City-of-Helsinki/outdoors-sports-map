import { LatLngTuple } from "leaflet";

type Locations = {
  HELSINKI: LatLngTuple;
  ESPOO: LatLngTuple;
  VANTAA: LatLngTuple;
};

export const locations: Locations = {
  HELSINKI: [60.171944, 24.941389],
  ESPOO: [60.19792, 24.708885],
  VANTAA: [60.309045, 25.004675],
};

export const POLL_INTERVAL = 2 * 60 * 1000;

export const views = {
  LIST: "list",
  MAP: "map",
};
