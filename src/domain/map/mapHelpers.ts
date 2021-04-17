const latLngToArray = (latlng: { lat: number; lng: number }): Array<number> => [
  latlng.lat,
  latlng.lng,
];

export default latLngToArray;
