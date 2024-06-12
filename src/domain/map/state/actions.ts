import { createAction } from "redux-actions";

import type { Action } from "../../app/appConstants";
import { mapActions } from "../mapConstants";

export const setLocation = (position: number[]): Action =>
  createAction(mapActions.SET_LOCATION)({
    position,
  });

export const receiveAddress = (
  address: Record<string, any> | null | undefined,
): Action =>
  createAction(mapActions.RECEIVE_ADDRESS)({
    address,
  });
