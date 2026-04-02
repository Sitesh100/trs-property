import { newRealStateAPI } from "@/redux/createAPI";

const leadsApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        submitLead: build.mutation({
            query: (payload) => ({
                url: "/api/leads",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const { useSubmitLeadMutation } = leadsApi;
