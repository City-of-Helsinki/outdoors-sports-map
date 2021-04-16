import keys from "lodash/keys";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import type { EntityAction } from "../common/constants";
import {
  IceSkatingServices,
  SkiingServices,
  SwimmingServices,
} from "../service/constants";
import { QualityEnum, UnitActions } from "./constants";
import { enumerableQuality, getUnitQuality } from "./helpers";

const isFetchingReducer = handleActions(
  {
    [UnitActions.FETCH]: () => true,
    [UnitActions.RECEIVE]: () => false,
    [UnitActions.FETCH_ERROR]: () => false,
  },
  false
);

const fetchErrorReducer = handleActions(
  {
    [UnitActions.FETCH]: () => null,
    [UnitActions.RECEIVE]: () => null,
    [UnitActions.FETCH_ERROR]: (
      state: Record<string, any>,
      { payload: { error } }
    ) => error,
  },
  null
);

const byIdReducer = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => ({ ...entities.unit }),
  },
  {}
);

const all = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [...keys(entities.unit)],
  },
  []
);

const iceskate = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService) => IceSkatingServices.indexOf(unitService) !== -1
        )
      ),
    ],
  },
  []
);

const ski = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService) => SkiingServices.indexOf(unitService) !== -1
        )
      ),
    ],
  },
  []
);

const swim = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService) => SwimmingServices.indexOf(unitService) !== -1
        )
      ),
    ],
  },
  []
);

const statusOk = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction
    ) => [
      ...keys(entities.unit).filter(
        (id) =>
          enumerableQuality(getUnitQuality(entities.unit[id])) <=
          QualityEnum.satisfactory
      ),
    ],
  },
  []
);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  fetchError: fetchErrorReducer,
  byId: byIdReducer,
  all,
  iceskate,
  ski,
  swim,
  status_ok: statusOk,
});

export default reducer;
