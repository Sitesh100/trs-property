import { newRealStateAPI } from "@/redux/createAPI";

const newsletterApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        subscribeNewsletter: build.mutation({
            query: (payload) => ({
                url: "/api/subscribe",
                method: "POST",
                body: typeof payload === "string" ? { email: payload } : payload,
            }),
        }),
    }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
