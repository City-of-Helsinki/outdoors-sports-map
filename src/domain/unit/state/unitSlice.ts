/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { union } from "lodash";
import intersection from "lodash/intersection";
import isEmpty from "lodash/isEmpty";
import keys from "lodash/keys";
import { normalize, schema } from "normalizr";

import {
  selectUnitResultIDs,
  selectIsActive,
} from "./searchSlice";
import { apiSlice } from "../../api/apiSlice";
import { AppState } from "../../app/types";
import {
  IceSkatingServices,
  IceSwimmingServices,
  SkiingServices,
  SleddingServices,
  SupportingServices,
  SwimmingServices,
} from "../../service/serviceConstants";
import { getOnSeasonServices } from "../../service/serviceHelpers";
import {
  HikingFilter,
  SkiingFilter,
  SportFilter,
  NormalizedUnitSchema,
  Unit,
} from "../types";
import {
  HikingFilters,
  SkiingFilters,
  UnitFilters,
  UnitFilterValues,
  QualityEnum,
  unitSchema,
} from "../unitConstants";
import {
  enumerableQuality,
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getFilteredUnitsBySportSpecification,
  getNoneHikingUnit,
  getUnitQuality,
  handleUnitConditionUpdates,
} from "../unitHelpers";

// Common parameters for unit API requests
const UNIT_API_COMMON_PARAMS = {
  only: "id,name,location,street_address,address_zip,extensions,services,municipality,phone,www,description,picture_url,extra",
  include: "observations,connections",
  geometry: "true",
  page_size: 1000,
} as const;

// RTK Query endpoint for fetching units
export const unitApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query for getting units based on specific services (for map display)
    getUnits: builder.query<NormalizedUnitSchema, { services?: number[] } | void>({
      query: (params = {}) => {
        const { services, ...otherParams } = params ?? {};
        const servicesToUse = services && services.length > 0 
          ? services 
          : getOnSeasonServices();
          
        return {
          url: "unit/",
          params: {
            service: servicesToUse.join(","),
            ...UNIT_API_COMMON_PARAMS,
            ...otherParams,
          },
        };
      },
      transformResponse: (response: { results: Unit[] }) => {
        return normalize(response.results, new schema.Array(unitSchema));
      },
    }),

    // Query for getting ALL seasonal units (for search suggestions)
    getAllSeasonalUnits: builder.query<NormalizedUnitSchema, void>({
      query: () => ({
        url: "unit/",
        params: {
          service: getOnSeasonServices().join(","),
          ...UNIT_API_COMMON_PARAMS,
        },
      }),
      transformResponse: (response: { results: Unit[] }) => {
        return normalize(response.results, new schema.Array(unitSchema));
      },
    }),

    // Query for getting a single unit by ID
    getUnitById: builder.query<Unit, string>({
      query: (unitId) => ({
        url: `unit/${unitId}/`,
        params: {
          ...UNIT_API_COMMON_PARAMS,
          geometry_3d: "true",
        },
      }),
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetUnitsQuery, useLazyGetUnitsQuery, useGetAllSeasonalUnitsQuery, useGetUnitByIdQuery } = unitApi;

// Helper function to filter units by service types
const filterUnitsByServices = (entities: Record<string, Unit>) => {
  const iceskate = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => IceSkatingServices.includes(unitService),
    ),
  );

  const ski = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => SkiingServices.includes(unitService),
    ),
  );

  const swim = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => SwimmingServices.includes(unitService),
    ),
  );

  const iceswim = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => IceSwimmingServices.includes(unitService),
    ),
  );

  const sledding = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => SleddingServices.includes(unitService),
    ),
  );

  const hike = keys(entities).filter((id) =>
    entities[id]?.services?.some(
      (unitService: number) => SupportingServices.includes(unitService),
    ),
  );

  const status_ok = keys(entities).filter(
    (id) => {
      const unit = entities[id];
      // Ensure unit exists and has required properties for quality assessment
      if (!unit?.observations) {
        return false;
      }
      return enumerableQuality(getUnitQuality(unit)) <= QualityEnum.satisfactory;
    },
  );

  return { iceskate, ski, swim, iceswim, sledding, hike, status_ok };
};

// Regular slice for unit state management
interface UnitState {
  isFetching: boolean;
  byId: Record<string, Unit>;
  all: string[];
  iceskate: string[];
  ski: string[];
  swim: string[];
  iceswim: string[];
  sledding: string[];
  status_ok: string[];
  hike: string[];
  // Seasonal units as fallback/backup
  seasonalById: Record<string, Unit>;
  seasonalAll: string[];
  seasonalIceskate: string[];
  seasonalSki: string[];
  seasonalSwim: string[];
  seasonalIceswim: string[];
  seasonalSledding: string[];
  seasonalStatusOk: string[];
  seasonalHike: string[];
}

export const initialUnitState: UnitState = {
  isFetching: false,
  byId: {},
  all: [],
  iceskate: [],
  ski: [],
  swim: [],
  iceswim: [],
  sledding: [],
  status_ok: [],
  hike: [],
  // Seasonal units as fallback
  seasonalById: {},
  seasonalAll: [],
  seasonalIceskate: [],
  seasonalSki: [],
  seasonalSwim: [],
  seasonalIceswim: [],
  seasonalSledding: [],
  seasonalStatusOk: [],
  seasonalHike: [],
};

const unitSlice = createSlice({
  name: "unit",
  initialState: initialUnitState,
  reducers: {
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    
    receiveUnits: (state, action: PayloadAction<NormalizedUnitSchema>) => {
      const { entities, result } = action.payload;
      
      if (!entities.unit) return;

      // Replace with new data (don't merge with existing)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedUnits = handleUnitConditionUpdates(entities.unit as any);
      state.byId = updatedUnits;
      
      // Replace with new unit IDs (don't merge)
      const newUnitIds = result.map(String);
      state.all = newUnitIds;

      // Filter units by service types using helper function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredUnits = filterUnitsByServices(entities.unit as any);

      // Replace filtered units (don't merge)
      state.iceskate = filteredUnits.iceskate;
      state.ski = filteredUnits.ski;
      state.swim = filteredUnits.swim;
      state.iceswim = filteredUnits.iceswim;
      state.sledding = filteredUnits.sledding;
      state.hike = filteredUnits.hike;
      state.status_ok = filteredUnits.status_ok;
    },

    receiveSeasonalUnits: (state, action: PayloadAction<NormalizedUnitSchema>) => {
      const { entities, result } = action.payload;
      
      if (!entities.unit) return;

      // Update seasonal storage with condition handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.seasonalById = handleUnitConditionUpdates(entities.unit as any);
      state.seasonalAll = result.map(String);

      // Filter seasonal units by service types using helper function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredUnits = filterUnitsByServices(entities.unit as any);

      // Update seasonal arrays with filtered data
      state.seasonalIceskate = filteredUnits.iceskate;
      state.seasonalSki = filteredUnits.ski;
      state.seasonalSwim = filteredUnits.swim;
      state.seasonalIceswim = filteredUnits.iceswim;
      state.seasonalSledding = filteredUnits.sledding;
      state.seasonalHike = filteredUnits.hike;
      state.seasonalStatusOk = filteredUnits.status_ok;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllSeasonalUnits query
      .addMatcher(unitApi.endpoints.getAllSeasonalUnits.matchFulfilled, (state, action) => {
        // Store seasonal units as fallback
        unitSlice.caseReducers.receiveSeasonalUnits(state, action);
      });
  },
});

export const { setIsFetching, receiveUnits, receiveSeasonalUnits } = unitSlice.actions;
export default unitSlice.reducer;

// Selectors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectUnitById = (state: AppState, props: Record<string, any>) => {
  // Use seasonal units if available, otherwise fall back to specific units
  const seasonalUnit = state.unit.seasonalById?.[props.id];
  return seasonalUnit || state.unit.byId?.[props.id];
};

export const selectVisibleUnits = createSelector(
  [
    (state: AppState) => state.unit,
    (state: AppState, sport: SportFilter = getDefaultSportFilter()) => sport,
    (
      state: AppState,
      sport: SportFilter = getDefaultSportFilter(),
      status: UnitFilterValues = getDefaultStatusFilter(),
    ) => status,
    (
      state: AppState,
      sport: SportFilter = getDefaultSportFilter(),
      status: UnitFilterValues = getDefaultStatusFilter(),
      sportSpecification: string = "",
    ) => sportSpecification,
    (state: AppState) => selectIsActive(state),
    (state: AppState) => selectUnitResultIDs(state),
  ],
  (unitState, sport, status, sportSpecification, isSearchActive, unitResultIDs): Unit[] => {
    // Smart fallback: use seasonal data as primary, specific data as backup
    const getDataForSport = (sportFilter: string) => {
      const seasonalProperty = `seasonal${sportFilter.charAt(0).toUpperCase()}${sportFilter.slice(1)}` as keyof typeof unitState;
      const seasonalData = unitState[seasonalProperty] as string[] || [];
      const specificData = unitState[sportFilter as keyof typeof unitState] as string[] || [];
      
      // Use seasonal data if available, otherwise fall back to specific data
      return seasonalData.length > 0 ? { data: seasonalData, isFromSeasonal: true } 
                                     : { data: specificData, isFromSeasonal: false };
    };

    // Get data for current sport to determine which byId to use
    const currentSportResult = getDataForSport(sport);

    // Use the appropriate byId based on current sport's data source
    const currentById = currentSportResult.isFromSeasonal ? unitState.seasonalById : unitState.byId;
    
    // Build sport data with smart fallback per sport
    const currentSportData = {
      [UnitFilters.ICE_SKATING]: getDataForSport(UnitFilters.ICE_SKATING).data,
      [UnitFilters.SKIING]: getDataForSport(UnitFilters.SKIING).data,
      [UnitFilters.SWIMMING]: getDataForSport(UnitFilters.SWIMMING).data,
      [UnitFilters.ICE_SWIMMING]: getDataForSport(UnitFilters.ICE_SWIMMING).data,
      [UnitFilters.SLEDDING]: getDataForSport(UnitFilters.SLEDDING).data,
      [UnitFilters.HIKING]: getDataForSport(UnitFilters.HIKING).data,
      [UnitFilters.STATUS_OK]: (() => {
        const seasonalStatus = unitState.seasonalStatusOk || [];
        const specificStatus = unitState.status_ok || [];
        return seasonalStatus.length > 0 ? seasonalStatus : specificStatus;
      })(),
    };

    const hasHikingSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => HikingFilters.includes(elm as HikingFilter));
    const hasSkiSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => SkiingFilters.includes(elm as SkiingFilter));

    let visibleUnits;
    if (hasHikingSportSpecification) {
      const selectedUnit = currentSportData[sport],
        hikeUnit = currentSportData[UnitFilters.HIKING],
        combinedUnit = selectedUnit.concat(hikeUnit);
      visibleUnits = combinedUnit;
    } else {
      visibleUnits = currentSportData[sport];
    }

    if (status === UnitFilters.STATUS_OK) {
      visibleUnits = intersection(
        visibleUnits,
        currentSportData[UnitFilters.STATUS_OK],
      );
    }

    if (sportSpecification) {
      // For helper functions, use the same byId as determined for current sport
      const unitDataForHelpers = currentSportResult.isFromSeasonal 
        ? { ...unitState, byId: unitState.seasonalById }
        : unitState;

      if (hasHikingSportSpecification) {
        visibleUnits = union(
          hasSkiSportSpecification
            ? getFilteredUnitsBySportSpecification(
                getNoneHikingUnit(visibleUnits, unitDataForHelpers),
                unitDataForHelpers,
                sportSpecification,
              )
            : getNoneHikingUnit(visibleUnits, unitDataForHelpers),
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitDataForHelpers,
            sportSpecification,
          ),
        );
      } else {
        visibleUnits = intersection(
          visibleUnits,
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitDataForHelpers,
            sportSpecification,
          ),
        );
      }
    }

    if (isSearchActive) {
      visibleUnits = intersection(visibleUnits, unitResultIDs);
    }

    return visibleUnits.map((id: string) => currentById[id]).filter(Boolean);
  },
);

export const selectIsUnitLoading = (state: AppState) =>
  state.unit.isFetching && isEmpty(state.unit.all);

// Selector for search loading - tracks getAllSeasonalUnits query
export const selectIsSearchLoading = (state: AppState) => {
  return unitApi.endpoints.getAllSeasonalUnits.select()(state).isLoading;
};

// Selector for map loading - shows when there's no data available and data is loading
export const selectIsMapLoading = (state: AppState) => {
  const hasSeasonalData = state.unit.seasonalAll.length > 0;
  const hasSpecificData = state.unit.all.length > 0;
  const isSeasonalLoading = unitApi.endpoints.getAllSeasonalUnits.select()(state).isLoading;
  const isSpecificLoading = state.unit.isFetching;
  
  // Show loading when no data is available and some query is loading
  return (!hasSeasonalData && !hasSpecificData) && (isSeasonalLoading || isSpecificLoading);
};
