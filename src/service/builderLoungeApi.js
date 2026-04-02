import { newRealStateAPI } from "@/redux/createAPI";

const builderLoungeApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        requestBuilderLoungeAccess: build.mutation({
            query: (payload) => ({
                url: "/api/builder-lounge/request",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const { useRequestBuilderLoungeAccessMutation } = builderLoungeApi;
