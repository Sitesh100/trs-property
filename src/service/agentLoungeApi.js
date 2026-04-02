import { newRealStateAPI } from "@/redux/createAPI";

const agentLoungeApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        requestAgentLoungeAccess: build.mutation({
            query: (payload) => ({
                url: "/api/agent-lounge/request",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const { useRequestAgentLoungeAccessMutation } = agentLoungeApi;
