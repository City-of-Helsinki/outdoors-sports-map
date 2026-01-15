import { RootState } from "../store/createStore";
import { SortKey, SportFilter, StatusFilter } from "../unit/types";

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