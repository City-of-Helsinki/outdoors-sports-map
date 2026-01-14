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
import { AppState } from "../../app/appConstants";
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
  HikingFilters,
  SkiingFilter,
  SkiingFilters,
  SportFilter,
  UnitFilters,
  UnitFilterValues,
  NormalizedUnitSchema,
  QualityEnum,
  Unit,
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



// RTK Query endpoint for fetching units
export const unitApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUnits: builder.query<NormalizedUnitSchema, Record<string, any> | void>({
      query: (params = {}) => ({
        url: "unit/",
        params: {
          service: getOnSeasonServices().join(","),
          only: "id,name,location,street_address,address_zip,extensions,services,municipality,phone,www,description,picture_url,extra",
          include: "observations,connections",
          geometry: "true",
          geometry_3d: "true",
          page_size: 1000,
          ...params,
        },
      }),
      transformResponse: (response: { results: Unit[] }) => {
        return normalize(response.results, new schema.Array(unitSchema));
      },
    }),
  }),
});

export const { useGetUnitsQuery, useLazyGetUnitsQuery } = unitApi;

// Regular slice for unit state management
interface UnitState {
  isFetching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchError: any | null;
  byId: Record<string, Unit>;
  all: string[];
  iceskate: string[];
  ski: string[];
  swim: string[];
  iceswim: string[];
  sledding: string[];
  status_ok: string[];
  hike: string[];
}

const initialState: UnitState = {
  isFetching: false,
  fetchError: null,
  byId: {},
  all: [],
  iceskate: [],
  ski: [],
  swim: [],
  iceswim: [],
  sledding: [],
  status_ok: [],
  hike: [],
};

const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    receiveUnits: (state, action: PayloadAction<NormalizedUnitSchema>) => {
      const { entities, result } = action.payload;
      
      if (!entities.unit) return;

      // Update byId with condition handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.byId = handleUnitConditionUpdates(entities.unit as any);
      state.all = (result as number[]).map(String);

      // Filter units by service type
      state.iceskate = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => IceSkatingServices.indexOf(unitService) !== -1,
        ),
      );

      state.ski = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => SkiingServices.indexOf(unitService) !== -1,
        ),
      );

      state.swim = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => SwimmingServices.indexOf(unitService) !== -1,
        ),
      );

      state.iceswim = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => IceSwimmingServices.indexOf(unitService) !== -1,
        ),
      );

      state.sledding = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => SleddingServices.indexOf(unitService) !== -1,
        ),
      );

      state.hike = keys(entities.unit).filter((id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entities.unit as any)[id].services.some(
          (unitService: number) => SupportingServices.indexOf(unitService) !== -1,
        ),
      );

      state.status_ok = keys(entities.unit).filter(
        (id) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          enumerableQuality(getUnitQuality((entities.unit as any)[id])) <=
          QualityEnum.satisfactory,
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFetchError: (state, action: PayloadAction<any>) => {
      state.fetchError = action.payload;
      state.isFetching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(unitApi.endpoints.getUnits.matchPending, (state) => {
        state.isFetching = true;
        state.fetchError = null;
      })
      .addMatcher(unitApi.endpoints.getUnits.matchFulfilled, (state, action) => {
        state.isFetching = false;
        // Automatically call receiveUnits when query succeeds
        unitSlice.caseReducers.receiveUnits(state, action);
      })
      .addMatcher(unitApi.endpoints.getUnits.matchRejected, (state, action) => {
        state.isFetching = false;
        state.fetchError = action.error;
      });
  },
});

export const { receiveUnits, setFetchError } = unitSlice.actions;
export default unitSlice.reducer;

// Selectors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectUnitById = (state: AppState, props: Record<string, any>) =>
  state.unit.byId[props.id];

export const selectAllUnits = (state: AppState) =>
  state.unit.all.map((id) =>
    selectUnitById(state, {
      id,
    }),
  );

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
      sportSpecification: string,
    ) => sportSpecification,
    (state: AppState) => selectIsActive(state),
    (state: AppState) => selectUnitResultIDs(state),
  ],
  (unitState, sport, status, sportSpecification, isSearchActive, unitResultIDs): Unit[] => {
    const hasHikingSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => HikingFilters.includes(elm as HikingFilter));
    const hasSkiSportSpecification = sportSpecification
      .split(",")
      .some((elm: string) => SkiingFilters.includes(elm as SkiingFilter));

    let visibleUnits;
    if (hasHikingSportSpecification) {
      const selectedUnit = unitState[sport],
        hikeUnit = unitState[UnitFilters.HIKING],
        combinedUnit = selectedUnit.concat(hikeUnit);
      visibleUnits = combinedUnit;
    } else {
      visibleUnits = unitState[sport];
    }

    if (status === UnitFilters.STATUS_OK) {
      visibleUnits = intersection(
        visibleUnits,
        unitState[UnitFilters.STATUS_OK],
      );
    }

    if (sportSpecification) {
      if (hasHikingSportSpecification) {
        visibleUnits = union(
          hasSkiSportSpecification
            ? getFilteredUnitsBySportSpecification(
                getNoneHikingUnit(visibleUnits, unitState),
                unitState,
                sportSpecification,
              )
            : getNoneHikingUnit(visibleUnits, unitState),
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitState,
            sportSpecification,
          ),
        );
      } else {
        visibleUnits = intersection(
          visibleUnits,
          getFilteredUnitsBySportSpecification(
            visibleUnits,
            unitState,
            sportSpecification,
          ),
        );
      }
    }

    if (isSearchActive) {
      visibleUnits = intersection(visibleUnits, unitResultIDs);
    }

    return visibleUnits.map((id: string) => unitState.byId[id]);
  },
);

export const selectIsUnitLoading = (state: AppState) =>
  state.unit.isFetching && isEmpty(state.unit.all);
