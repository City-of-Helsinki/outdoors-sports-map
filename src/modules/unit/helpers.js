//@flow
import {has, keys, sortBy} from 'lodash';
import {LatLng} from 'leaflet';
import {UNIT_PIN_HEIGHT, UNIT_HANDLE_HEIGHT, UnitQuality, QualityEnum, UnitFilters, IceSkatingServices, SkiingServices/*, SwimmingServices*/} from './constants';
import {DEFAULT_LANG} from '../common/constants';

export const getAttr = (attr: Object, lang: ?string = DEFAULT_LANG) => {
  let translated = has(attr, lang) && attr[lang];
  if (!translated) {
    for (let i = 0; i < keys(attr).length; ++i) {
      translated = attr[keys(attr)[i]];
      if (translated) {
        break;
      }
    }
  }
  return translated || null;
};

export const getUnitPosition = (unit: Object): Array<number> => {
  // TODO: REMOVE THIS WHEN SKI TRACK LOCATIONS ARE CORRECT IN API
  if (unit.geometry && unit.geometry.coordinates) {
    return unit.geometry.coordinates[0][0].slice().reverse();
  }

  return unit.location.coordinates.slice().reverse();
};

export const getUnitSport = (unit: Object) => {
  if(unit.services && unit.services.length) {
    const service = unit.services[0];

    if (IceSkatingServices.includes(service.id)) {
      return UnitFilters.ICE_SKATING;
    }

    if (SkiingServices.includes(service.id)) {
      return UnitFilters.SKIING;
    }

    // if (SwimmingServices.includes(service.id)) {
    //   return UnitFilters.SWIMMING;
    // }
  }

  return 'unknown';
};

export const getServiceName = (unit: Object, language: ?string = DEFAULT_LANG) => {
  return getAttr(unit.services[0].name, language);
};

export const getObservation = (unit: Object, matchProperty: ?string='condition') => {
  const {observations} = unit;
  return observations ? observations.find((obs) => obs.property.includes(matchProperty)) : null;
};

export const getUnitQuality = (unit: Object): string => {
  const observation = getObservation(unit);
  return observation ? observation.quality : UnitQuality.UNKNOWN;
};

export const enumerableQuality = (quality: string): number => {
  return QualityEnum[quality] ? QualityEnum[quality] : Number.MAX_VALUE;
};


/**
 * ICONS
 */

export const getUnitIconURL = (unit: Object, selected: ?boolean = false, retina: ?boolean = true) => {
  const quality = getUnitQuality(unit);
  const sport = getUnitSport(unit);
  const onOff = selected ? 'on' : 'off';
  const resolution = retina ? '@2x' : '';

  return require(`@assets/markers/${sport}-${quality}-${onOff}${resolution}.png`);
};

export const getUnitIconHeight = (unit: Object) => (
  getUnitSport(unit) === UnitFilters.SKIING ? UNIT_HANDLE_HEIGHT : UNIT_PIN_HEIGHT
);


export const getUnitIcon = (unit: Object, selected: ?boolean = false) => (
  {
    url: getUnitIconURL(unit, selected, false),
    retinaUrl: getUnitIconURL(unit, selected, true),
    height: getUnitIconHeight(unit)
  }
);

export const getFilterIconURL = (filter: String) =>
  filter ? require(`@assets/icons/icon-white-${filter}@2x.png`) : '';

/**
 * SORT UNIT LIST
 */

export const sortByDistance = (units: Array<Object>, position: Array<number>) =>
  sortBy(units, (unit) => {
    const unitLatLng = new LatLng(...getUnitPosition(unit));
    const mapLatLng = new LatLng(...position);
    return unitLatLng.distanceTo(mapLatLng);
  });

export const sortByName = (units: Array, lang: ?string) =>
  sortBy(units, (unit) => getAttr(unit.name, lang));

export const sortByCondition = (units: Array) =>
  sortBy(units, [
    (unit) => {
      return enumerableQuality(getUnitQuality(unit));
    },
    (unit) => {
      const observation = getObservation(unit);
      const observationTime =
        observation && observation.time && (new Date(observation.time)).getTime() || 0;

      return (new Date()).getTime() - observationTime;
    }
  ]);

export const getAddressToDisplay = (address) => {
  return address ? address.street.name.fi+', '+address.street.municipality : 'Location not found :(';
}
