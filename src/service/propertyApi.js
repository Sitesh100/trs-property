import { newRealStateAPI } from "@/redux/createAPI";

/* ==========================================
   NEW API ENDPOINTS (Using New Base URL - http://localhost:8000)
   ========================================== */

const propertyApiNew = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // 1. Upload Property Images
        // POST /property-images/upload
        // Upload multiple images and get image IDs in response
        uploadPropertyImages: build.mutation({
            query: (formData) => ({
                url: `/upload-image`,
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),

        // 2. Create Property
        // POST /createproperty
        // Create a new property with all details including image_ids
        createProperty: build.mutation({
            query: (payload) => ({
                url: `/current-properties/create`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['properties'],
        }),

        // 3. Get All Properties
        // GET /properties
        // List down all properties including image ids
        getAllProperties: build.query({
            query: () => `/current-properties`,
            providesTags: ['properties'],
            transformResponse: (response) => {
                // Normalize response structure to match component expectations
                // If response is already in the expected format, return it as is
                // If response is a direct array, wrap it
                if (Array.isArray(response)) {
                    return {
                        data: {
                            properties: response
                        }
                    };
                }
                // If already in expected format, return as is
                return response;
            },
        }),

        // 4. Download Property Images
        // POST /property-images/download
        // Download images for given image_ids
        downloadPropertyImages: build.mutation({
            query: (payload) => ({
                url: `/property-images/download`,
                method: "POST",
                body: payload,
            }),
        }),

        // 5. Get Property by ID (if needed for details)
        // Note: This endpoint is not provided in the spec, but keeping for compatibility
        // You may need to implement this on backend if required
        getPropertyById: build.query({
            query: (id) => `/properties/${id}`,
            providesTags: (result, error, id) => [{ type: 'properties', id }],
        }),
    }),
});

// Export hooks for new API
export const {
    useUploadPropertyImagesMutation,
    useCreatePropertyMutation,
    useGetAllPropertiesQuery,
    useDownloadPropertyImagesMutation,
    useGetPropertyByIdQuery,
} = propertyApiNew;

