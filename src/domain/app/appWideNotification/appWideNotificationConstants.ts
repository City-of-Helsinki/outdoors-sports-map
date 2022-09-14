import { normalizeActionName } from "../../utils";

export const AppWideNotificationActions = {
  FETCH: normalizeActionName("appWideNotification/FETCH"),
  RECEIVE: normalizeActionName("appWideNotification/RECEIVE"),
  FETCH_ERROR: normalizeActionName("appWideNotification/FETCH_ERROR"),
};

export type AppWideNotificationState = {
  isFetching: boolean;
  data: Array<AppWideNotificationObject>;
  fetchError: any;
};

type TranslatedNotificationText = {
  fi: String;
  en?: String;
  sv?: String;
};

export type AppWideNotificationObject = {
  content: TranslatedNotificationText;
  external: TranslatedNotificationText;
  external_url_title: TranslatedNotificationText;
  lead_paragraph: TranslatedNotificationText;
  picture_url: String;
  title: TranslatedNotificationText;
  id: Number;
};
