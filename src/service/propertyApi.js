import { realStateAPI } from "@/redux/createAPI";

const propertyApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        getProperty: build.query({
            query: () => `property/view/`,
            providesTags: ['getProperty', 'getCustomerProperty']
        }),
        getCustomerProperty: build.query({
            query: () => `property/customer_view/`,
            providesTags: ['getProperty', 'getCustomerProperty']
        }),
        getSingleProperty: build.query({
            query: (id) => `property/property_detail/?property_id=${id}`
        }),
        addAndEditBothProperty: build.mutation({
            query: (formValues) => {
                const payload = {
                    title: formValues?.title,
                    property_type: formValues?.property_type,
                    city: formValues?.city,
                    project_name: formValues?.project_name,
                    possession_status: formValues?.possession_status,
                    property_post_status: formValues?.property_post_status,
                    expected_price: formValues?.expected_price,
                    booking_amount: formValues?.booking_amount,
                    carpet_area: formValues?.carpet_area,
                    super_area: formValues?.super_area,
                    bedrooms: formValues?.bedrooms,
                    bathrooms: formValues?.bathrooms,
                    balconies: formValues?.balconies,
                    rera_id: formValues?.rera_id,
                    builder_name: formValues?.builder_name,
                    nearby_landmarks: formValues?.nearby_landmarks,
                    id: formValues?.id
                };
                return {
                    url: formValues?.id ? `property/customer_update/` : `property/store/`,
                    method: formValues?.id ? "PATCH" : "POST",
                    body: payload,
                }
            },
            invalidatesTags: ['getProperty', 'getCustomerProperty']
        }),
        uploadPropertyImage: build.mutation({
            query: ({ imageForm }) => {
                return {
                    url: `property/property_image_store/`,
                    method: "POST",
                    body: imageForm,
                    formData: true,
                }
            },
        }),
        uploadPropertyDocument: build.mutation({
            query: ({ docForm }) => {
                return {
                    url: `property/property_document_store/`,
                    method: "POST",
                    body: docForm,
                    formData: true,
                }
            },
            invalidatesTags: ['getProperty', 'getCustomerProperty']
        }),
        deleteProperty: build.mutation({
            query: (id) => ({
                url: `property/customer_delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['getCustomerProperty']
        }),
    }),
});

export const {
    useGetPropertyQuery,
    useGetCustomerPropertyQuery,
    useGetSinglePropertyQuery,
    useAddAndEditBothPropertyMutation,
    useUploadPropertyDocumentMutation,
    useUploadPropertyImageMutation,
    useDeletePropertyMutation,
} = propertyApi;

