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
                
                // Add optional query parameters if they exist
                if (params?.city) queryParams.append('city', params.city);
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
} = propertyApiNew;

