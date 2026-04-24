import { newRealStateAPI } from "@/redux/createAPI";
import { getRoleBucket } from "@/utils/authCookies";

const getBuyRequirementBasePath = (roleValue) => {
    const roleBucket = getRoleBucket(roleValue);
    return roleBucket === "agent" || roleBucket === "builder"
        ? "/api/users/buy-requirements"
        : "/api/customer/buy-requirements";
};

const buyRequirementApi = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // POST /api/customer/buy-requirements or /api/users/buy-requirements - Post buy requirement
        addBuyRequirement: build.mutation({
            query: ({ formValues, role } = {}) => ({
                url: getBuyRequirementBasePath(role),
                method: "POST",
                body: {
                    requirement_type: formValues.requirement_type,
                    buy_or_rent: formValues.requirement_type,
                    city: formValues.city,
                    property_type: formValues.property_type,
                    bhk: formValues.bhk ? Number(formValues.bhk) : null,
                    min_price: Number(formValues.min_price) || 0,
                    max_price: Number(formValues.max_price) || 0,
                    min_carpet_area: Number(formValues.min_carpet_area) || 0,
                    max_carpet_area: Number(formValues.max_carpet_area) || 0,
                    possession_status: formValues.possession_status,
                },
            }),
            invalidatesTags: ['buyRequirements'],
        }),

        // GET /api/customer/buy-requirements or /api/users/buy-requirements - Get all buy requirements
        getBuyRequirements: build.query({
            query: (role) => getBuyRequirementBasePath(role),
            transformResponse: (response) => {
                // Handle both raw array and wrapped payloads across environments.
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.data?.data)) return response.data.data;
                if (Array.isArray(response?.data?.items)) return response.data.items;
                if (Array.isArray(response?.items)) return response.items;
                if (Array.isArray(response?.results)) return response.results;
                return [];
            },
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
            async queryFn(req_id, _api, _extraOptions, baseQuery) {
                const normalizeMatches = (responseData) => {
                    if (Array.isArray(responseData)) return responseData;
                    if (Array.isArray(responseData?.data)) return responseData.data;
                    if (Array.isArray(responseData?.results)) return responseData.results;
                    if (Array.isArray(responseData?.items)) return responseData.items;
                    if (Array.isArray(responseData?.matches)) return responseData.matches;
                    if (Array.isArray(responseData?.matched_properties)) return responseData.matched_properties;
                    if (Array.isArray(responseData?.data?.results)) return responseData.data.results;
                    if (Array.isArray(responseData?.data?.items)) return responseData.data.items;
                    return [];
                };

                const specificResponse = await baseQuery(`/api/customer/buy-requirements/${req_id}/matches`);
                if (!specificResponse?.error) {
                    return { data: normalizeMatches(specificResponse.data) };
                }

                const errorDetail = specificResponse?.error?.data?.detail;
                const shouldFallbackToAllMatches =
                    typeof errorDetail === "string" && errorDetail.includes("min_budget");

                if (!shouldFallbackToAllMatches) {
                    return specificResponse;
                }

                const allMatchesResponse = await baseQuery(`/api/customer/buy-requirements/matches/all`);
                if (allMatchesResponse?.error) {
                    return specificResponse;
                }

                const allMatches = normalizeMatches(allMatchesResponse.data);
                const filteredMatches = allMatches.filter((item) => {
                    const requirementId =
                        item?.req_id ??
                        item?.requirement_id ??
                        item?.buy_requirement_id ??
                        item?.requirement?.id;

                    return Number(requirementId) === Number(req_id);
                });

                return { data: filteredMatches };
            },
            providesTags: (result, error, req_id) => [{ type: 'requirementMatches', id: req_id }],
        }),

        // GET /api/customer/buy-requirements/matches/all - Get all matches for the customer
        getAllRequirementMatches: build.query({
            query: () => `/api/customer/buy-requirements/matches/all`,
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.results)) return response.results;
                if (Array.isArray(response?.items)) return response.items;
                if (Array.isArray(response?.matches)) return response.matches;
                if (Array.isArray(response?.matched_properties)) return response.matched_properties;
                if (Array.isArray(response?.data?.results)) return response.data.results;
                if (Array.isArray(response?.data?.items)) return response.data.items;
                return [];
            },
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

