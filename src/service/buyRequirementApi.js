import { realStateAPI } from "@/redux/createAPI";

const buyRequirementApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getBuyRequirement: build.query({
            query: () => `property/property_matches/`,
        }),
        addBuyRequirement: build.mutation({
            query: (formValues) => {
                return {
                    url: `property/buy_requirement_store/`,
                    method: "POST",
                    body: formValues,
                }
            },
        }),
    }),
});

export const {
    useGetBuyRequirementQuery,
    useAddBuyRequirementMutation
} = buyRequirementApi;

