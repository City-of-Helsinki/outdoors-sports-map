import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize, schema } from "normalizr";

import { selectUnitById } from "./unitSlice";
import { digitransitApiHeaders } from "../../api/apiHelpers";
import { apiSlice } from "../../api/apiSlice";
import type { AppState } from "../../app/types";
import { getOnSeasonServices } from "../../service/serviceHelpers";
import {
  Unit,
  NormalizedUnitSchema,
} from "../types";
import {
  unitSchema,
  MAX_SUGGESTION_COUNT,
} from "../unitConstants";

// Types for API responses
interface DigitransitFeature {
  properties: {
    label: string;
    layer: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface DigitransitResponse {
  features: DigitransitFeature[];
}

interface SuggestionsResponse {
  units: NormalizedUnitSchema;
  addresses: DigitransitFeature[];
}

// RTK Query endpoints for search
export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchUnits: builder.query<
      NormalizedUnitSchema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { input: string; params?: Record<string, any> }
    >({
      async queryFn({ input, params = {} }, _api, _extraOptions, fetchWithBQ) {
        let request;

        // For search, always use ALL seasonal services regardless of current filter selection
        // Remove any service parameter from params to prevent filtering by current sport
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { service, ...filteredParams } = params;
        
        const combinedParams = {
          input,
          service: getOnSeasonServices().join(","),
          type: "unit",
          ...filteredParams,
        };

        // Make search request only when there's input
        if (input?.length) {
          request = {
            url: "search/",
            params: combinedParams,
          };
        } else {
          // Otherwise get all units
          request = {
            url: "unit/",
            params: {
              service: combinedParams.service,
              only: "id,name,location,street_address,address_zip,extensions,services,municipality,phone,www,description,picture_url,extra",
              include: "observations,connections",
              geometry: "true",
              geometry_3d: "true",
              page_size: 1000,
              ...params,
            },
          };
        }

        const response = await fetchWithBQ(request);

        if (response.error) {
          return { error: response.error };
        }

        const bodyAsJson = response.data as { results: Unit[] };
        let data: NormalizedUnitSchema = { entities: { unit: {} }, result: [] };

        if (bodyAsJson.results) {
          data = normalize(
            bodyAsJson.results,
            new schema.Array(unitSchema),
          ) as NormalizedUnitSchema;
        }

        return { data };
      },
    }),

    searchSuggestions: builder.query<SuggestionsResponse, string>({
      async queryFn(input, api, _extraOptions, fetchWithBQ) {
        let data: NormalizedUnitSchema = { entities: { unit: {} }, result: [] };
        let addressData: DigitransitFeature[] = [];

        // Make search request only when there's input
        if (input?.length) {
          // Fetch unit suggestions
          const unitResponse = await fetchWithBQ({
            url: "search/",
            params: {
              input,
              service: getOnSeasonServices().join(","),
              page_size: MAX_SUGGESTION_COUNT,
              type: "unit",
            },
          });

          // Fetch address suggestions from Digitransit
          const addressResponse = await fetchWithBQ({
            url: "https://api.digitransit.fi/geocoding/v1/search",
            params: {
              text: input,
              "boundary.rect.min_lat": 59.9,
              "boundary.rect.max_lat": 60.45,
              "boundary.rect.min_lon": 24.3,
              "boundary.rect.max_lon": 25.5,
              "focus.point.lat": 60.17,
              "focus.point.lon": 24.94,
              size: 5,
              lang: "fi",
            },
            headers: digitransitApiHeaders(),
          });

          if (unitResponse.error) {
            return { error: unitResponse.error };
          }

          if (addressResponse.error) {
            return { error: addressResponse.error };
          }

          const unitBodyAsJson = unitResponse.data as { results: Unit[] };
          const addressBodyAsJson = addressResponse.data as DigitransitResponse;

          if (unitBodyAsJson.results) {
            data = normalize(
              unitBodyAsJson.results,
              new schema.Array(unitSchema),
            ) as NormalizedUnitSchema;
          }

          if (addressBodyAsJson?.features) {
            // Filter out stops and deduplicate by label
            const filtered = addressBodyAsJson.features.filter(
              (feature) => feature.properties.layer !== "stop",
            );

            addressData = [
              ...new Map(
                filtered.map((feature) => [feature.properties.label, feature]),
              ).values(),
            ];
          }
        }

        return {
          data: {
            units: data,
            addresses: addressData,
          },
        };
      },
    }),
  }),
});

export const { useSearchUnitsQuery, useLazySearchUnitsQuery, useSearchSuggestionsQuery, useLazySearchSuggestionsQuery } =
  searchApi;

// Search state slice
interface SearchState {
  isFetching: boolean;
  isActive: boolean;
  unitResults: string[];
  unitSuggestions: string[];
  addressSuggestions: DigitransitFeature[];
}

export const initialSearchState: SearchState = {
  isFetching: false,
  isActive: false,
  unitResults: [],
  unitSuggestions: [],
  addressSuggestions: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    clearSearch: (state) => {
      state.isActive = false;
      state.unitResults = [];
      state.unitSuggestions = [];
      state.addressSuggestions = [];
    },
    setUnitSuggestions: (state, action: PayloadAction<NormalizedUnitSchema>) => {
      state.unitSuggestions = action.payload.result.map(String);
    },
    setAddressSuggestions: (state, action: PayloadAction<DigitransitFeature[]>) => {
      state.addressSuggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle searchUnits query
    builder
      .addMatcher(searchApi.endpoints.searchUnits.matchPending, (state) => {
        state.isFetching = true;
      })
      .addMatcher(searchApi.endpoints.searchUnits.matchFulfilled, (state, action) => {
        state.isFetching = false;
        state.isActive = true;
        state.unitResults = action.payload.result.map(String);
        // Clear suggestions when performing actual search
        state.unitSuggestions = [];
      })
      .addMatcher(searchApi.endpoints.searchUnits.matchRejected, (state) => {
        state.isFetching = false;
      });
  },
});

export const { clearSearch, setUnitSuggestions, setAddressSuggestions } = searchSlice.actions;
export default searchSlice.reducer;

// Selectors
export const selectIsActive = (state: AppState): boolean => state.search.isActive;

export const selectIsFetching = (state: AppState): boolean =>
  state.search.isFetching;

const selectUnitSuggestionIds = (state: AppState) => state.search.unitSuggestions;

export const selectUnitSuggestions = createSelector(
  [selectUnitSuggestionIds, (state: AppState) => state],
  (unitSuggestions, state): Unit[] => {
    return unitSuggestions.map((id) =>
      selectUnitById(state, {
        id,
      }),
    );
  }
);

export const selectUnitResultIDs = (state: AppState): string[] =>
  state.search.unitResults;

export const selectAddresses = (state: AppState): DigitransitFeature[] =>
  state.search.addressSuggestions;
