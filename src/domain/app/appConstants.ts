import { RootState } from "../bootstrap/createStore";
import { SortKey, SportFilter, StatusFilter } from "../unit/unitConstants";

export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const DIGITRANSIT_API_BASE_URL =
  process.env.REACT_APP_DIGITRANSIT_API_URL;

export const DIGITRANSIT_API_KEY = process.env.REACT_APP_DIGITRANSIT_API_KEY;

export const APP_NAME = process.env.REACT_APP_APP_NAME;

export const DEFAULT_LANG = "fi";

export const mobileBreakpoint = 768;

export type Action = {
  type: string;
  payload: Record<string, any>;
};

export type FetchAction = {
  type: string;
  payload: {
    params: Record<string, any>;
  };
};

export type PositionAction = {
  type: string;
  payload: {
    position: Record<string, any>;
  };
};

export type EntityAction = {
  type: string;
  payload: {
    entities: Record<string, any>;
    result: string[];
  };
};

export type AppState = RootState;

export type QueryValue = string | Array<string>;

export type Address = {
  location: {
    coordinates: [number, number];
  };
};

export type AppSearch = {
  q?: string;
  sport?: SportFilter;
  status?: StatusFilter;
  sportSpecification?: string;
  sortKey?: SortKey;
  maxUnitCount?: string;
};

export type AppSearchLocationState = {
  search?: AppSearch;
  previous?: string;
};
