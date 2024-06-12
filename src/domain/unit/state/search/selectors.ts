import type { AppState } from "../../../app/appConstants";
import { Unit } from "../../unitConstants";
import { getUnitById } from "../selectors";

export const getIsActive = (state: AppState): boolean => state.search.isActive;

export const getIsFetching = (state: AppState): boolean =>
  state.search.isFetching;

export const getUnitResults = (state: AppState): Array<Record<string, any>> =>
  state.search.unitResults.map((id) =>
    getUnitById(state, {
      id,
    }),
  );

export const getUnitSuggestions = (state: AppState): Unit[] =>
  state.search.unitSuggestions.map((id) =>
    getUnitById(state, {
      id,
    }),
  );

export const getUnitResultIDs = (state: AppState): string[] =>
  state.search.unitResults;

export const getAddresses = (state: AppState): Record<string, any>[] =>
  state.search.addressSuggestions;
