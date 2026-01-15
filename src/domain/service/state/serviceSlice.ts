import { createSelector } from "@reduxjs/toolkit";
import { normalize, schema } from "normalizr";

import { apiSlice } from "../../api/apiSlice";
import { getOnSeasonServices } from "../serviceHelpers";

export type Service = {
  id: number;
  name: {
    fi?: string;
    en?: string;
    sv?: string;
  };
};

export type NormalizedServicesState = {
  byId: Record<string, Service>;
  all: string[];
};

export const serviceSchema = new schema.Entity<Service>("service", undefined, {
  idAttribute: (value) => value.id.toString(),
});

export const serviceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<NormalizedServicesState, void>({
      query: () => ({
        url: "service/",
        params: {
          id: getOnSeasonServices(),
          only: "id,name",
          page_size: 1000,
        },
      }),
      transformResponse: (response: { results: Service[] }) => {
        const normalized = normalize(response.results, new schema.Array(serviceSchema));
        return {
          byId: normalized.entities.service || {},
          all: normalized.result || [],
        };
      },
      providesTags: ["Service"],
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;

// Stable empty default to avoid creating new objects
const EMPTY_SERVICES_STATE: NormalizedServicesState = { byId: {}, all: [] };

// Create stable selector instance (don't call select() inside a function)
const selectServicesQueryResult = serviceApi.endpoints.getServices.select();

// Selectors for backward compatibility
export const selectServicesState = createSelector(
  [selectServicesQueryResult],
  (queryResult) => queryResult.data || EMPTY_SERVICES_STATE
);

export const selectServicesObject = createSelector(
  [selectServicesState],
  (servicesState) => servicesState.byId
);

export const selectIsFetchingService = createSelector(
  [selectServicesQueryResult],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (queryResult) => queryResult.isLoading || (queryResult as any).isFetching || false
);