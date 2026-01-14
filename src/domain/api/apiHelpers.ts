import { normalize, Schema } from "normalizr";

import {
  API_BASE_URL,
  DIGITRANSIT_API_BASE_URL,
  DIGITRANSIT_API_KEY,
} from "../app/appConstants";

export const normalizeEntityResults = <
  T,
  E = { [key: string]: { [key: string]: T } | undefined },
  R = any,
>(
  results: any,
  schema: Schema<T>,
) => normalize<T, E, R>(results, schema);

export const stringifyQuery = (query: Record<string, any>): string =>
  Object.keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join("="))
    .join("&");

export const createRequest = (url: string, init?: RequestInit): Request =>
  new Request(url, init);

export const createUrl = (url: string, params: Record<string, any>): string =>
  `${API_BASE_URL || ""}/${url}${params ? `?${stringifyQuery(params)}` : ""}`;

export const digitransitApiHeaders = () => ({
  "Cache-Control": "no-cache",
  "digitransit-subscription-key": `${DIGITRANSIT_API_KEY}`,
});

export const createDigitransitUrl = (
  url: string,
  params: Record<string, any>,
): string =>
  `${DIGITRANSIT_API_BASE_URL || ""}/${url}${
    params ? `?${stringifyQuery(params)}` : ""
  }`;

export const createDigitransitRequest = (
  url: string,
  init?: RequestInit,
): Request => new Request(url, { headers: digitransitApiHeaders(), ...init });
