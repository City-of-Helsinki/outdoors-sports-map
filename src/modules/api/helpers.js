// @flow
import { call } from 'redux-saga/effects';
import { normalize } from 'normalizr';
import { API_BASE_URL, DIGITRANSIT_API_BASE_URL } from '../common/constants';
import type { ApiResponse } from './constants';

export const normalizeEntityResults = (results: Object, schema: Object) =>
  normalize(results, schema);

export function* callApi(request: Request): Generator<any, ApiResponse, any> {
  const response: Object = yield call(fetch, request);
  if (response.status === 404) {
    const bodyAsJson = { results: 'Error, 404 not found' };
    return { response, bodyAsJson };
  }
  const bodyAsJson = yield call([response, response.json]);
  return { response, bodyAsJson };
}

export const stringifyQuery = (query: Object): string =>
  Object.keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join('='))
    .join('&');

export const createRequest = (url: string, init: Object | void): Request =>
  new Request(url, init);

export const createUrl = (url: string, params: Object): string =>
  `${API_BASE_URL || ''}/${url}${params ? `?${stringifyQuery(params)}` : ''}`;

export const createDigitransitUrl = (url: string, params: Object): string =>
  `${DIGITRANSIT_API_BASE_URL || ''}/${url}${
    params ? `?${stringifyQuery(params)}` : ''
  }`;
