import { basedUrl } from "@/libs/based-url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const realStateAPI = createApi({
    reducerPath: "realStateAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: basedUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['profileKYC', 'getProperty', 'getCustomerProperty', 'requestStatus', 'favorite'],
    endpoints: () => ({}),
});
