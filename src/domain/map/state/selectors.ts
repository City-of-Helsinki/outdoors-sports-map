import { AppState } from "../../app/appConstants";

export const getLocation = (state: AppState) => state.map.location;

export const getAddress = (state: AppState) => state.map.address;
