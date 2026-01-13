// Service ID constants
export const UnitServices = {
  MECHANICALLY_FROZEN_ICE: 695,
  ICE_SKATING_FIELD: 406,
  ICE_RINK: 235,
  SPEED_SKATING_TRACK: 514,
  ICE_SKATING_ROUTE: 407,
  SKI_TRACK: 191,
  DOG_SKI_TRACK: 318,
  SWIMMING_BEACH: 731,
  SWIMMING_PLACE: 730,
  OUTDOOR_POOL: 426,
  ICE_SWIMMING_PLACE: 684,
  LEAN_TO: 365,
  INFORMATION_POINT: 482,
  COOKING_FACILITY: 586,
  CAMPING: 698,
  SKI_LODGE: 734,
  SLEDDING_HILL: 1083,
};

export const IceSkatingServices = [
  UnitServices.MECHANICALLY_FROZEN_ICE,
  UnitServices.ICE_SKATING_FIELD,
  UnitServices.ICE_RINK,
  UnitServices.SPEED_SKATING_TRACK,
  UnitServices.ICE_SKATING_ROUTE,
];

export const SkiingServices = [
  UnitServices.SKI_TRACK,
  UnitServices.DOG_SKI_TRACK,
];

export const SwimmingServices = [
  UnitServices.SWIMMING_BEACH,
  UnitServices.SWIMMING_PLACE,
  UnitServices.OUTDOOR_POOL,
];

export const IceSwimmingServices = [UnitServices.ICE_SWIMMING_PLACE];

export const SleddingServices = [UnitServices.SLEDDING_HILL];

export const SupportingServices = [
  UnitServices.LEAN_TO,
  UnitServices.COOKING_FACILITY,
  UnitServices.CAMPING,
  UnitServices.SKI_LODGE,
];

export const SummerSupportingServices = [
  UnitServices.LEAN_TO,
  UnitServices.CAMPING,
];

export const YearRoundSupportingServices = [
  UnitServices.COOKING_FACILITY,
  UnitServices.SKI_LODGE,
];
