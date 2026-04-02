import { newRealStateAPI } from "@/redux/createAPI";

const homeLoanApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        applyHomeLoan: build.mutation({
            query: (payload) => ({
                url: "/api/home-loans/apply",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const { useApplyHomeLoanMutation } = homeLoanApi;
