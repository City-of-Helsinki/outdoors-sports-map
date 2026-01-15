import { apiSlice } from "../../api/apiSlice";

// Helper to convert object to URL-encoded form data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyQuery = (params: Record<string, any>): string => {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
};

export const appApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation<void, { feedback: string; email?: string | null }>({
      query: ({ feedback, email }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, any> = {
          description: feedback,
          service_request_type: "OTHER",
          can_be_published: false,
          internal_feedback: true,
          service_code: 2807,
        };

        if (email) {
          params.email = email;
        }

        return {
          url: "https://api.hel.fi/servicemap/open311/",
          method: "POST",
          body: stringifyQuery(params),
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),
  }),
});

export const { useSendFeedbackMutation } = appApi;
