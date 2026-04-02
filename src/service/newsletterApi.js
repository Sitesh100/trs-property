import { newRealStateAPI } from "@/redux/createAPI";

const newsletterApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        subscribeNewsletter: build.mutation({
            query: (email) => ({
                url: "/api/subscribe",
                method: "POST",
                body: { email },
            }),
        }),
    }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
