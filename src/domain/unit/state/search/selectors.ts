import { createSelector } from "@reduxjs/toolkit";

import type { AppState } from "../../../app/appConstants";
import { Unit } from "../../unitConstants";
import { selectUnitById } from "../selectors";

export const getIsActive = (state: AppState): boolean => state.search.isActive;

export const getIsFetching = (state: AppState): boolean =>
  state.search.isFetching;

const selectUnitResultIds = (state: AppState) => state.search.unitResults;
const selectUnitSuggestionIds = (state: AppState) => state.search.unitSuggestions;

export const getUnitResults = createSelector(
  [selectUnitResultIds, (state: AppState) => state],
  (unitResults, state): Array<Record<string, any>> =>
    unitResults.map((id) =>
      selectUnitById(state, {
        id,
      }),
    )
);

export const getUnitSuggestions = createSelector(
  [selectUnitSuggestionIds, (state: AppState) => state],
  (unitSuggestions, state): Unit[] =>
    unitSuggestions.map((id) =>
      selectUnitById(state, {
        id,
      }),
    )
);

export const getUnitResultIDs = (state: AppState): string[] =>
  state.search.unitResults;

export const getAddresses = (state: AppState): Record<string, any>[] =>
  state.search.addressSuggestions;
