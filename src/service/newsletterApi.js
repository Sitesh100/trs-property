import { newRealStateAPI } from "@/redux/createAPI";

const newsletterApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        subscribeNewsletter: build.mutation({
            query: (payload) => {
                // Send only non-empty contact fields so email/phone can be optional individually.
                const source = typeof payload === "string" ? { email: payload } : payload || {};
                const body = {};

                if (typeof source.email === "string" && source.email.trim()) {
                    body.email = source.email.trim();
                }

                if (typeof source.phone === "string" && source.phone.trim()) {
                    body.phone = source.phone.trim();
                }

                return {
                    url: "/api/subscribe",
                    method: "POST",
                    body,
                };
            },
        }),
    }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
