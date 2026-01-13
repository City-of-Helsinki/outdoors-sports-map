import { createSelector } from "@reduxjs/toolkit";

import { Address, AppState } from "../../app/appConstants";

export const selectLocation = (state: AppState) => state.map.location;

// Get address from RTK Query cache
// This gets the most recent address query result
export const selectAddress = createSelector(
  [
    selectLocation,
    (state: AppState) => state.api?.queries
  ],
  (location, queries): Address | null | undefined => {
    if (!location || !queries) return null;
    
    const [lat, lon] = location;
    const queryKey = `getAddress({"lat":${lat},"lon":${lon}})`;
    const addressQuery = queries[queryKey];
    
    return addressQuery?.data as Address | undefined || null;
  }
);
