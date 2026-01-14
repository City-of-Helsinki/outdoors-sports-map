import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";

import { apiSlice } from "../../api/apiSlice";
import { Address, AppState } from "../../app/appConstants";
import { locations } from "../../home/homeConstants";

// RTK Query endpoint for reverse geocoding
export const mapApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddress: builder.query<Address, { lat: number; lon: number }>({
      query: ({ lat, lon }) => ({
        url: "address/",
        params: {
          lat,
          lon,
          page_size: 1,
        },
      }),
      transformResponse: (response: { results: Address[] }) => {
        return response.results && response.results.length > 0
          ? response.results[0]
          : ({} as Address);
      },
      providesTags: ["Address"],
    }),
  }),
});

export const { useGetAddressQuery, useLazyGetAddressQuery } = mapApi;

// Regular slice for map location state (not API-related)
const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: locations.HELSINKI,
  },
  reducers: {
    setLocation: (state, action: PayloadAction<LatLngTuple>) => {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = mapSlice.actions;

// Selectors
const selectMapState = (state: AppState) => state.map;

export const selectLocation = createSelector(
  [selectMapState],
  (map) => map.location
);

// Selector for address from RTK Query cache based on specific coordinates
const selectAddressQueryResult = (lat: number, lon: number) => 
  mapApi.endpoints.getAddress.select({ lat, lon });

export const selectAddressByCoordinates = (state: AppState, lat: number, lon: number) => {
  const queryResult = selectAddressQueryResult(lat, lon)(state);
  return queryResult.data || null;
};

// Selector for address based on current location
export const selectAddress = createSelector(
  [selectLocation, (state: AppState) => state],
  (location, state) => {
    if (!location) return null;
    const [lat, lon] = location;
    return selectAddressByCoordinates(state, lat, lon);
  }
);

export default mapSlice.reducer;
