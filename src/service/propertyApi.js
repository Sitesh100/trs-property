import { newRealStateAPI } from "@/redux/createAPI";


const propertyApiNew = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        uploadPropertyImages: build.mutation({
            query: (formData) => ({
                url: `/upload-image`,
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),
        createProperty: build.mutation({
            query: (payload) => ({
                url: `/current-properties/create`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['properties'],
        }),

        getAllProperties: build.query({
            query: () => `/current-properties`,
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

        // downloadPropertyImages: build.mutation({
        //     query: (payload) => ({
        //         url: `/property-images/download`,
        //         method: "POST",
        //         body: payload,
        //     }),
        // }),
        // getPropertyById: build.query({
        //     query: (id) => `/properties/${id}`,
        //     providesTags: (result, error, id) => [{ type: 'properties', id }],
        // }),
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

