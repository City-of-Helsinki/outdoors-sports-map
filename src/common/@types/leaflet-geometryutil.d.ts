declare module "leaflet-geometryutil" {
  export function computeAngle(a: L.Point, b: L.Point): number;
  export function closest(
    map: L.Map,
    layer: L.LatLng[] | L.LatLng[][] | L.PolyLine | L.Polygon,
    latlng: L.LatLng,
    vertices?: boolean,
  ): L.LatLng;
}
