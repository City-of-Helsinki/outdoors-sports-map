import { AppState } from "../common/constants";

export const getLocation = (state: AppState) => state.map.location;

export const getAddress = (state: AppState) => state.map.address;
