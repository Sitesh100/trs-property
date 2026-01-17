import { realStateAPI } from "@/redux/createAPI";

const authApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        sendOtp: build.mutation({
            query: (formValues) => {
                const formData = new FormData();
                formData.append("mobile_no", formValues?.phone);
                formData.append("role", formValues?.role);
                return {
                    url: `authentication/v1/user/send_otp/`,
                    method: "POST",
                    body: formData,
                    formData: true,
                }
            },
        }),
        verifyOtp: build.mutation({
            query: ({ otp, phone, role }) => {
                const formData = new FormData();
                formData.append("mobile_no", phone);
                formData.append("role", role);
                formData.append("otp", otp);
                return {
                    url: `authentication/v1/user/verify_otp/`,
                    method: "POST",
                    body: formData,
                    formData: true,
                }
            },
        }),
        signUp: build.mutation({
            query: (formValues) => {
                const formData = new FormData();
                formData.append("first_name", formValues?.first_name);
                formData.append("last_name", formValues?.last_name);
                formData.append("email", formValues?.email);
                formData.append("mobile_no", formValues?.mobile_no);
                formData.append("company_name", formValues?.company_name);
                formData.append("city", formValues?.city);
                formData.append("role", formValues?.role);
                return {
                    url: `authentication/v1/user/register/`,
                    method: "POST",
                    body: formData,
                    formData: true,
                }
            },
        }),
    }),
});

export const { useSignUpMutation, useSendOtpMutation, useVerifyOtpMutation } = authApi;




