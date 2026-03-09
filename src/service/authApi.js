import { realStateAPI, newRealStateAPI } from "@/redux/createAPI";

// ========================================
// 📝 OLD OTP-BASED API (COMMENTED OUT)
// ========================================
/*
const authApiOld = realStateAPI.injectEndpoints({
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
*/

const authApiNew = newRealStateAPI.injectEndpoints({
    endpoints: (build) => ({
        // 1. Register Customer
        // POST /register/customer
        registerCustomer: build.mutation({
            query: (formValues) => ({
                url: `/register/customer`,
                method: "POST",
                body: {
                    full_name: formValues.fullName,
                    email: formValues.email,
                    phone: formValues.phone,
                    password: formValues.password,
                    city: formValues.city,
                },
            }),
        }),

        // 2. Register Agent
        // POST /register/agent
        registerAgent: build.mutation({
            query: (formValues) => ({
                url: `/register/agent`,
                method: "POST",
                body: {
                    full_name: formValues.fullName,
                    email: formValues.email,
                    phone: formValues.phone,
                    password: formValues.password,
                    city: formValues.city,
                    rera_number: formValues.reraNumber || "",
                    agency_name: formValues.agencyName,
                },
            }),
        }),

        // 3. Register Builder
        // POST /register/builder
        registerBuilder: build.mutation({
            query: (formValues) => ({
                url: `/register/builder`,
                method: "POST",
                body: {
                    company_name: formValues.companyName,
                    contact_person: formValues.contactPersonName,
                    email: formValues.email,
                    phone: formValues.phone,
                    password: formValues.password,
                    rera_number: formValues.reraRegistrationNumber,
                    city: formValues.city,
                },
            }),
        }),

        // Login - Get Access Token (OAuth2 Password Grant)
        // POST /login
        // Content-Type: application/x-www-form-urlencoded
        login: build.mutation({
            query: (formValues) => {
                // Create form-urlencoded body
                const formBody = new URLSearchParams({
                    grant_type: "password",
                    username: formValues.username, // email address
                    password: formValues.password,
                    scope: formValues.scope || "",
                    client_id: formValues.client_id || "",
                    client_secret: formValues.client_secret || "",
                }).toString();

                return {
                    url: `/login`,
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody,
                };
            },
        }),

        // 1. Direct Signup (No OTP) - OLD
        // POST /api/auth/signup
        directSignup: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/signup`,
                method: "POST",
                body: {
                    fullName: formValues.fullName,
                    phone: formValues.phone,
                    role: formValues.role, 
                },
            }),
        }),

        // 2. Direct Login (No OTP)
        // POST /api/auth/login
        directLogin: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/login`,
                method: "POST",
                body: {
                    phone: formValues.phone,
                },
            }),
        }),

        // ========================================
        // 📝 OLD OTP-BASED ENDPOINTS (COMMENTED)
        // ========================================
        
        /* 
        // 1. Signup - Send OTP
        // POST /api/auth/signup
        signupSendOtp: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/signup`,
                method: "POST",
                body: {
                    fullName: formValues.fullName,
                    phone: formValues.phone,
                    role: formValues.role, // customer, builder, or agent
                },
            }),
        }),

        // 2. Signup - Verify OTP
        // POST /api/auth/signup/verify-otp
        signupVerifyOtp: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/signup/verify-otp`,
                method: "POST",
                body: {
                    fullName: formValues.fullName,
                    phone: formValues.phone,
                    otp: formValues.otp,
                    role: formValues.role,
                },
            }),
        }),

        // 3. Login - Send OTP
        // POST /api/auth/send-otp
        loginSendOtp: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/send-otp`,
                method: "POST",
                body: {
                    phone: formValues.phone,
                },
            }),
        }),

        // 4. Login - Verify OTP
        // POST /api/auth/verify-otp
        loginVerifyOtp: build.mutation({
            query: (formValues) => ({
                url: `/api/auth/verify-otp`,
                method: "POST",
                body: {
                    phone: formValues.phone,
                    otp: formValues.otp,
                },
            }),
        }),
        */

        // 5. Get Current User
        // GET /api/auth/me
        getCurrentUser: build.query({
            query: () => `/api/auth/me`,
            providesTags: ['currentUser'],
        }),
    }),
});

// ========================================
// 📝 OLD HOOKS (COMMENTED OUT - OTP functionality removed)
// ========================================
/*
export const { 
    useSendOtpMutation, 
    useVerifyOtpMutation, 
    useSignUpMutation 
} = authApiOld;
*/

// Export NEW hooks (Role-Based Registration & Login)
export const {
    useRegisterCustomerMutation,
    useRegisterAgentMutation,
    useRegisterBuilderMutation,
    useLoginMutation,
    useDirectSignupMutation,
    useDirectLoginMutation,
    useGetCurrentUserQuery,
} = authApiNew;

// 📝 OLD OTP-based hooks (COMMENTED OUT)
/*
export const {
    useSignupSendOtpMutation,
    useSignupVerifyOtpMutation,
    useLoginSendOtpMutation,
    useLoginVerifyOtpMutation,
    useGetCurrentUserQuery,
} = authApiNew;
*/




