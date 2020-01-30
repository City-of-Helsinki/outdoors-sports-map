// @flow
import { createAction } from 'redux-actions';
import { ServiceActions } from './constants';
import type { Action } from '../common/constants';
import type { ApiResponse } from '../api/constants';

export const fetchServices = (params: Object): Action => createAction(ServiceActions.FETCH)({ params });

export const receiveServices = (data: ApiResponse): Action => createAction(ServiceActions.RECEIVE)(data);

export const setFetchError = (error: ApiResponse) => createAction(ServiceActions.FETCH_ERROR)({ error });
