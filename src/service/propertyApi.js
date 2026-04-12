import { newRealStateAPI } from "@/redux/createAPI";


const propertyApiNew = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // Upload Property Images
        uploadPropertyImages: build.mutation({
            query: (formData) => ({
                url: `/upload-image`,
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),

        // Create Property (Auth Required: Agent/Builder/Customer)
        // POST /createproperty
        createProperty: build.mutation({
            query: (payload) => ({
                url: `/createproperty`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['properties'],
        }),

        // Get All Properties (Paginated)
        // GET /properties?skip=0&limit=10
        getAllProperties: build.query({
            query: (params = {}) => {
                const skip = params.skip || 0;
                const limit = params.limit || 1000;
                return `/properties?skip=${skip}&limit=${limit}`;
            },
            providesTags: ['properties'],
            transformResponse: (response) => {
                if (Array.isArray(response)) {
                    return {
                        data: {
                            properties: response
                        }
                    };
                }
                return response;
            },
        }),

        // Search & Filter Properties
        // GET /properties/search
        searchProperties: build.query({
            query: (params = {}) => {
                console.log('🔧 searchProperties query called with params:', params);
                
                const queryParams = new URLSearchParams();
                const normalizeBooleanParam = (value) => {
                    if (typeof value === 'boolean') return value;
                    if (typeof value === 'string') {
                        const normalized = value.trim().toLowerCase();
                        if (normalized === 'true' || normalized === 'yes') return true;
                        if (normalized === 'false' || normalized === 'no') return false;
                    }
                    return null;
                };
                const normalizePossessionStatus = (value) => {
                    if (!value) return null;
                    const normalized = String(value).trim().toUpperCase();

                    if (normalized === 'READY_TO_MOVE' || normalized === 'UNDER_CONSTRUCTION') {
                        return normalized;
                    }

                    if (normalized === 'READY-TO-MOVE' || normalized === 'EADY-TO-MOVE') {
                        return 'READY_TO_MOVE';
                    }

                    if (normalized === 'UNDER-CONSTRUCTION') {
                        return 'UNDER_CONSTRUCTION';
                    }

                    return null;
                };
                
                // Add optional query parameters if they exist
                if (params?.city) queryParams.append('search_query', params.city);
                if (params?.property_type) queryParams.append('property_type', params.property_type);
                if (params?.min_price !== undefined && params?.min_price !== null) {
                    queryParams.append('min_price', params.min_price);
                }
                if (params?.max_price !== undefined && params?.max_price !== null) {
                    queryParams.append('max_price', params.max_price);
                }
                if (params?.bedrooms !== undefined && params?.bedrooms !== null) {
                    queryParams.append('bedrooms', params.bedrooms);
                }
                if (params?.bathrooms !== undefined && params?.bathrooms !== null) {
                    queryParams.append('bathrooms', params.bathrooms);
                }
                const possessionStatus = normalizePossessionStatus(params?.possession_status);
                if (possessionStatus) queryParams.append('possession_status', possessionStatus);
                const negotiableValue = normalizeBooleanParam(params?.is_price_negotiable);
                if (negotiableValue !== null) {
                    queryParams.append('is_price_negotiable', negotiableValue);
                }
                if (params?.status) queryParams.append('status', params.status);
                if (params?.skip !== undefined) queryParams.append('skip', params.skip || 0);
                if (params?.limit !== undefined) queryParams.append('limit', params.limit || 10);
                
                const queryString = queryParams.toString();
                const finalUrl = `/properties/search${queryString ? `?${queryString}` : ''}`;
                
                console.log('🌐 Final API URL:', finalUrl);
                return finalUrl;
            },
            providesTags: ['properties'],
            transformResponse: (response) => {
                console.log('📥 searchProperties response:', response);
                // Handle both array and object responses
                if (Array.isArray(response)) {
                    return {
                        data: {
                            properties: response
                        }
                    };
                }
                return response;
            },
        }),

        // Get Single Property Details
        // GET /properties/{property_id}
        getPropertyById: build.query({
            query: (id) => `/properties/${id}`,
            providesTags: (result, error, id) => [{ type: 'properties', id }],
        }),

        // Get Similar Properties
        // GET /properties/{property_id}/similar
        getSimilarProperties: build.query({
            query: (propertyId) => `/api/properties/${propertyId}/similar`,
            providesTags: (result, error, propertyId) => [{ type: 'properties', id: `similar-${propertyId}` }],
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.results)) return response.results;
                if (Array.isArray(response?.properties)) return response.properties;
                return [];
            },
        }),

        // Get My Properties (Auth Required)
        // GET /my-properties?skip=0&limit=100
        getMyProperties: build.query({
            query: (params = {}) => {
                const skip = params.skip || 0;
                const limit = params.limit || 100;
                return `/my-properties?skip=${skip}&limit=${limit}`;
            },
            providesTags: ['myProperties'],
            transformResponse: (response) => {
                // Handle both array and object responses
                if (Array.isArray(response)) {
                    return {
                        data: {
                            properties: response
                        }
                    };
                }
                return response;
            },
        }),

        // Update Property (Auth Required)
        // PUT /my-properties/{property_id}
        updateProperty: build.mutation({
            query: ({ property_id, ...payload }) => ({
                url: `/my-properties/${property_id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ['myProperties', 'properties'],
        }),

        // Delete Property (Auth Required)
        // DELETE /my-properties/{property_id}
        deleteProperty: build.mutation({
            query: (property_id) => ({
                url: `/my-properties/${property_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['myProperties', 'properties'],
        }),
    }),
});

// Export hooks for new API
export const {
    useUploadPropertyImagesMutation,
    useCreatePropertyMutation,
    useGetAllPropertiesQuery,
    useSearchPropertiesQuery,
    useLazySearchPropertiesQuery,
    useDownloadPropertyImagesMutation,
    useGetPropertyByIdQuery,
    useGetSimilarPropertiesQuery,
    useGetMyPropertiesQuery,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = propertyApiNew;

