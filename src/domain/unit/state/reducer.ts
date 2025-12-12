import keys from "lodash/keys";
import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { Action, EntityAction } from "../../app/appConstants";
import {
  IceSkatingServices,
  SkiingServices,
  SwimmingServices,
  IceSwimmingServices,
  SupportingServices,
  SleddingServices,
} from "../../service/serviceConstants";
import { QualityEnum, UnitActions } from "../unitConstants";
import {
  enumerableQuality,
  getUnitQuality,
  handleUnitConditionUpdates,
} from "../unitHelpers";

const isFetchingReducer = handleActions(
  {
    [UnitActions.FETCH]: () => true,
    [UnitActions.RECEIVE]: () => false,
    [UnitActions.FETCH_ERROR]: () => false,
  },
  false,
);

const fetchErrorReducer = handleActions(
  {
    [UnitActions.FETCH]: () => null,
    [UnitActions.RECEIVE]: () => null,
    [UnitActions.FETCH_ERROR]: (
      state: Record<string, any> | null,
      { payload: { error } }: Action,
    ) => error,
  },
  null,
);

const byIdReducer = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => handleUnitConditionUpdates(entities.unit),
  },
  {},
);

const all = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { result } }: EntityAction,
    ) => result,
  },
  [],
);

const iceskate = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) =>
            IceSkatingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const ski = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) => SkiingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const swim = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) => SwimmingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const iceswim = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) =>
            IceSwimmingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const sledding = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) => SleddingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const supportingService = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter((id) =>
        entities.unit[id].services.some(
          (unitService: number) =>
            SupportingServices.indexOf(unitService) !== -1,
        ),
      ),
    ],
  },
  [],
);

const statusOk = handleActions(
  {
    [UnitActions.RECEIVE]: (
      state: Record<string, any>,
      { payload: { entities } }: EntityAction,
    ) => [
      ...keys(entities.unit).filter(
        (id) =>
          enumerableQuality(getUnitQuality(entities.unit[id])) <=
          QualityEnum.satisfactory,
      ),
    ],
  },
  [],
);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  fetchError: fetchErrorReducer,
  byId: byIdReducer,
  all,
  iceskate,
  ski,
  swim,
  iceswim,
  sledding,
  status_ok: statusOk,
  hike: supportingService,
});

export default reducer;
