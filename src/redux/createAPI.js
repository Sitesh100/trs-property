import { basedUrl, newBasedUrl } from "@/libs/based-url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Original API instance for old endpoints
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
    tagTypes: [
        'profileKYC', 
        'getProperty', 
        'getCustomerProperty', 
        'requestStatus', 
        'favorite',
    ],
    endpoints: () => ({}),
});

export const newRealStateAPI = createApi({
    reducerPath: "newRealStateAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: newBasedUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            // Explicitly set Content-Type for JSON requests
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
            return headers;
        },
    }),
    tagTypes: [
        'properties',
        'myProperties',
        'currentUser',
        'customerProfile',
        'favorites',
        'buyRequirements',
        'requirementMatches',
    ],
    endpoints: () => ({}),
});
