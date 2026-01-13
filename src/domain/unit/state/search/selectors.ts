import { createSelector } from "@reduxjs/toolkit";

import type { AppState } from "../../../app/appConstants";
import { Unit } from "../../unitConstants";
import { selectUnitById } from "../selectors";

export const selectIsActive = (state: AppState): boolean => state.search.isActive;

export const selectIsFetching = (state: AppState): boolean =>
  state.search.isFetching;

const selectUnitSuggestionIds = (state: AppState) => state.search.unitSuggestions;

export const selectUnitSuggestions = createSelector(
  [selectUnitSuggestionIds, (state: AppState) => state],
  (unitSuggestions, state): Unit[] =>
    unitSuggestions.map((id) =>
      selectUnitById(state, {
        id,
      }),
    )
);

export const selectUnitResultIDs = (state: AppState): string[] =>
  state.search.unitResults;

export const selectAddresses = (state: AppState): Record<string, any>[] =>
  state.search.addressSuggestions;
