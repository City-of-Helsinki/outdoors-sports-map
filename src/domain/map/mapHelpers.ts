import { MAP_URL_TEMPLATE } from "../app/appConstants";

export const latLngToArray = (latlng: {
  lat: number;
  lng: number;
}): Array<number> => [latlng.lat, latlng.lng];

export const getMapUrl = (locale: string, suffix: string) => {
  const styleLanguage = ["fi", "sv"].includes(locale) ? locale : "fi";
  const url = MAP_URL_TEMPLATE || "";
  return url.replace(/{language}/, styleLanguage).replace(/{suffix}/, suffix);
};
