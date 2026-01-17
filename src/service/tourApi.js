import { realStateAPI } from "@/redux/createAPI";

const tourApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getRequestStatusProperty: build.query({
            query: (id) => `property/request_status/?property_id=${id}`,
            providesTags: ['requestStatus']
        }),
        requestTour: build.mutation({
            query: (payload) => ({
                url: `property/call_request/`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['requestStatus']
        }),
    }),
});

export const {
    useRequestTourMutation,
    useGetRequestStatusPropertyQuery
} = tourApi;
