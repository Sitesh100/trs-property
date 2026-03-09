import { realStateAPI, newRealStateAPI } from "@/redux/createAPI";

// ========================================
// 📝 OLD API (COMMENTED OUT)
// ========================================
const profileApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        profileUpdate: build.mutation({
            query: (formValues) => {
                const formData = new FormData();
                formData.append("first_name", formValues?.first_name);
                formData.append("last_name", formValues?.last_name);
                formData.append("email", formValues?.email);
                formData.append("mobile_no", formValues?.mobile_no);
                formData.append("company_name", formValues?.company_name);
                formData.append("city", formValues?.city);
                if (formValues?.image) {
                    formData.append("image", formValues?.image);
                }
                return {
                    url: `authentication/v1/user/update_profile/`,
                    method: "PATCH",
                    body: formData,
                    formData: true,
                }
            },
        }),
        profileKYC: build.mutation({
            query: (formValues) => {
                const formData = new FormData();
                if (formValues?.govt_id) {
                    formData.append("govt_id", formValues?.govt_id);
                }
                if (formValues?.visiting_card) {
                    formData.append("visiting_card", formValues?.visiting_card);
                }
                if (formValues?.rera_certificate) {
                    formData.append("rera_certificate", formValues?.rera_certificate);
                }
                return {
                    url: `authentication/v1/user/update_kyc/`,
                    method: "PATCH",
                    body: formData,
                    formData: true,
                }
            },
            invalidatesTags: ['profileKYC']
        }),
        getProfileKYC: build.query({
            query: () => `authentication/v1/user/kyc_view/`,
            providesTags: ['profileKYC']
        }),
    }),
});

// ========================================
// 📝 NEW API - Customer Profile
// ========================================
const profileApiNew = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // GET /api/customer/profile - Get customer profile
        getCustomerProfile: build.query({
            query: () => `/api/customer/profile`,
            providesTags: ['customerProfile'],
        }),

        // PUT /api/customer/profile - Update customer profile
        updateCustomerProfile: build.mutation({
            query: (formValues) => ({
                url: `/api/customer/profile`,
                method: "PUT",
                body: {
                    full_name: formValues.full_name,
                    phone: formValues.phone,
                    city: formValues.city,
                    company_name: formValues.company_name || null,
                },
            }),
            invalidatesTags: ['customerProfile'],
        }),
    }),
});

// Export OLD hooks
export const { useProfileUpdateMutation, useProfileKYCMutation, useGetProfileKYCQuery } = profileApi;

// Export NEW hooks
export const { useGetCustomerProfileQuery, useUpdateCustomerProfileMutation } = profileApiNew;

