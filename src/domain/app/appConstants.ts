import { RootState } from "../store/createStore";
import { SortKey, SportFilter, StatusFilter } from "../unit/unitConstants";

export const API_BASE_URL = import.meta.env.REACT_APP_API_URL;

export const MAP_URL_TEMPLATE = import.meta.env.REACT_APP_MAP_URL_TEMPLATE;

export const DIGITRANSIT_API_BASE_URL =
  import.meta.env.REACT_APP_DIGITRANSIT_API_URL;

export const DIGITRANSIT_API_KEY = import.meta.env.REACT_APP_DIGITRANSIT_API_KEY;

export const APP_NAME = import.meta.env.REACT_APP_APP_NAME;

export const DEFAULT_LANG = "fi";

export const mobileBreakpoint = 768;

export type Action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
};

export type FetchAction = {
  type: string;
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>;
  };
};

export type PositionAction = {
  type: string;
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    position: Record<string, any>;
  };
};

export type EntityAction = {
  type: string;
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
