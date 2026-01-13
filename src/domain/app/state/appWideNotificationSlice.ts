import { apiSlice } from "../../api/apiSlice";

export type TranslatedNotificationText = {
  fi: string;
  en?: string;
  sv?: string;
};

export type AppWideNotificationObject = {
  content: TranslatedNotificationText;
  external: TranslatedNotificationText;
  external_url_title: TranslatedNotificationText;
  lead_paragraph: TranslatedNotificationText;
  picture_url: string;
  title: TranslatedNotificationText;
  id: number;
};

export const appWideNotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppWideNotifications: builder.query<AppWideNotificationObject[], void>({
      query: () => ({
        url: "announcement/",
        params: {
          outdoor_sports_map_usage: 1,
        },
      }),
      transformResponse: (response: { results: AppWideNotificationObject[] }) =>
        response.results,
      providesTags: ["AppWideNotification"],
    }),
  }),
});

export const { useGetAppWideNotificationsQuery } = appWideNotificationApi;

