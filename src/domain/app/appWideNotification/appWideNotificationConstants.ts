import { schema, NormalizedSchema } from "normalizr";

import { normalizeActionName } from "../../utils";

export const AppWideNotificationActions = {
  FETCH: normalizeActionName("appWideNotification/FETCH"),
  RECEIVE: normalizeActionName("appWideNotification/RECEIVE"),
  FETCH_ERROR: normalizeActionName("appWideNotification/FETCH_ERROR"),
};

export type AppWideNotificationState = {
  isFetching: boolean;
  byId: Record<string, any>;
  fetchError: any;
  all: Array<string>;
};

export const appWideNotificationSchema = new schema.Entity<AppWideNotification>("AppWideNotification", undefined, {
  idAttribute: (value) => value.id.toString(),
});

export type AppWideNotification = {
  id: string;
};

export type NormalizedAppWideNotification = {
  unit: {
    [id: number]: NormalizedSchema<AppWideNotification, number>;
  };
};

export type NormalizedAppWideNotificationSchema = NormalizedSchema<
  NormalizedAppWideNotification,
  number[]
>;
