import { realStateAPI, newRealStateAPI } from "@/redux/createAPI";

// ========================================
// 📝 OLD API (COMMENTED OUT)
// ========================================
const buyRequirementApiOld = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getBuyRequirementOld: build.query({
            query: () => `property/property_matches/`,
        }),
        addBuyRequirementOld: build.mutation({
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

// ========================================
// 📝 NEW API - Buy Requirements
// ========================================
const buyRequirementApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // POST /api/customer/buy-requirements - Post buy requirement
        addBuyRequirement: build.mutation({
            query: (formValues) => ({
                url: `/api/customer/buy-requirements`,
                method: "POST",
                body: {
                    city: formValues.city,
                    property_type: formValues.property_type,
                    min_price: Number(formValues.min_price) || 0,
                    max_price: Number(formValues.max_price) || 0,
                    min_carpet_area: Number(formValues.min_carpet_area) || 0,
                    max_carpet_area: Number(formValues.max_carpet_area) || 0,
                    possession_status: formValues.possession_status,
                },
            }),
            invalidatesTags: ['buyRequirements'],
        }),

        // GET /api/customer/buy-requirements - Get all buy requirements (if needed)
        getBuyRequirements: build.query({
            query: () => `/api/customer/buy-requirements`,
            providesTags: ['buyRequirements'],
        }),

        // DELETE /api/customer/buy-requirements/{req_id} - Delete buy requirement
        deleteBuyRequirement: build.mutation({
            query: (req_id) => ({
                url: `/api/customer/buy-requirements/${req_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['buyRequirements'],
        }),

        // GET /api/customer/buy-requirements/{req_id}/matches - Get matches for a requirement
        getRequirementMatches: build.query({
            query: (req_id) => `/api/customer/buy-requirements/${req_id}/matches`,
            providesTags: (result, error, req_id) => [{ type: 'requirementMatches', id: req_id }],
        }),

        // GET /api/customer/buy-requirements/matches/all - Get all matches for the customer
        getAllRequirementMatches: build.query({
            query: () => `/api/customer/buy-requirements/matches/all`,
            providesTags: ['requirementMatches'],
        }),
    }),
});

export const {
    useAddBuyRequirementMutation,
    useGetBuyRequirementsQuery,
    useDeleteBuyRequirementMutation,
    useGetRequirementMatchesQuery,
    useGetAllRequirementMatchesQuery,
} = buyRequirementApi;

