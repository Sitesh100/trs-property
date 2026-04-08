"use client";
import { 
  useRegisterCustomerMutation,
  useRegisterAgentMutation,
  useRegisterBuilderMutation 
} from "@/service/authApi";
import { setToken, setUser } from "@/redux/authSlice";
import { useFormik } from "formik";
import { Loader, X, User, Briefcase, Building2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { setAuthCookies } from "@/utils/authCookies";

function SignupForm({ setActiveTab, onClose, sendOtpInfo, setSendOtpInfo }) {
  const dispatch = useDispatch();
  
  // Role-based registration mutations
  const [registerCustomer, { isLoading: isLoadingCustomer }] = useRegisterCustomerMutation();
  const [registerAgent, { isLoading: isLoadingAgent }] = useRegisterAgentMutation();
  const [registerBuilder, { isLoading: isLoadingBuilder }] = useRegisterBuilderMutation();
  
  const [selectedRole, setSelectedRole] = useState("customer");

  // Determine loading state based on selected role
  const isLoading = 
    (selectedRole === "customer" && isLoadingCustomer) ||
    (selectedRole === "agent" && isLoadingAgent) ||
    (selectedRole === "builder" && isLoadingBuilder);

  // Dynamic validation schema based on role
  const validationSchema = useMemo(() => {
    const baseSchema = {
      phone: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile Number is required"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      city: Yup.string().required("City is required"),
      role: Yup.string()
        .oneOf(["customer", "agent", "builder"], "Select a valid role")
        .required("Role is required"),
    };

    if (selectedRole === "customer") {
      return Yup.object({
        ...baseSchema,
        fullName: Yup.string().required("Full Name is required"),
      });
    } else if (selectedRole === "agent") {
      return Yup.object({
        ...baseSchema,
        fullName: Yup.string().required("Full Name is required"),
        agencyName: Yup.string().required("Agency Name is required"),
        reraNumber: Yup.string(),
        officeAddress: Yup.string().required("Office Address is required"),
      });
    } else if (selectedRole === "builder") {
      return Yup.object({
        ...baseSchema,
        companyName: Yup.string().required("Company Name is required"),
        contactPersonName: Yup.string().required("Contact Person Name is required"),
        companyAddress: Yup.string().required("Company Address is required"),
        reraRegistrationNumber: Yup.string().required("RERA Registration Number is required"),
      });
    }

    return Yup.object(baseSchema);
  }, [selectedRole]);

  const formik = useFormik({
    initialValues: {
      // Common fields
      phone: sendOtpInfo?.phone || "",
      email: "",
      password: "",
      city: "",
      role: "customer",
      
      // Customer fields
      fullName: "",
      
      // Agent fields
      agencyName: "",
      reraNumber: "",
      officeAddress: "",
      
      // Builder fields
      companyName: "",
      contactPersonName: "",
      companyAddress: "",
      reraRegistrationNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let response;

        // Call appropriate registration API based on role
        if (values.role === "customer") {
          response = await registerCustomer({
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            city: values.city,
          }).unwrap();
        } else if (values.role === "agent") {
          response = await registerAgent({
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            city: values.city,
            agencyName: values.agencyName,
            reraNumber: values.reraNumber,
          }).unwrap();
        } else if (values.role === "builder") {
          response = await registerBuilder({
            companyName: values.companyName,
            contactPersonName: values.contactPersonName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            reraRegistrationNumber: values.reraRegistrationNumber,
            city: values.city,
          }).unwrap();
        }

        console.log("✅ Registration successful:", response);
        
        // Check if response indicates success
        if (response?.success === false || response?.error) {
          // API returned an error in the response body
          const errorMessage = response?.detail || response?.message || response?.error || 'Registration failed';
          throw { data: { detail: errorMessage } };
        }
        
        // If token and user data are returned, store them and close modal
        const token = response?.token || response?.data?.token;
        const user = response?.user || response?.data?.user;
        
        if (token && user) {
          toast.success("Registration successful!");
          dispatch(setToken(token));
          dispatch(setUser(user));
          setAuthCookies({
            token,
            role: user?.role || user?.user_role || values.role,
          });
          window.dispatchEvent(new Event("resume-form-submit"));
          onClose();
        } else {
          // If no token, show success message and redirect to login tab
          toast.success("Registration successful! Please login to continue.");
          setSendOtpInfo({
            phone: values.phone,
            email: values.email,
            role: values.role,
          });
          setActiveTab("sendOtp");
        }
      } catch (err) {
        console.error("❌ Registration error:", err);
        const errorMessage = err?.data?.detail || err?.data?.message || err?.data?.error || 'Registration failed';
        
        // Check if user already exists - redirect to login
        if (errorMessage.toLowerCase().includes('already registered') || 
            errorMessage.toLowerCase().includes('already exists') ||
            errorMessage.toLowerCase().includes('phone already')) {
          toast.error("Phone number already registered. Please login instead.");
          setSendOtpInfo({
            phone: values.phone,
            role: values.role,
          });
          setActiveTab("sendOtp");
        } else {
          toast.error(errorMessage);
        }
      }
    },
  });

  return (
    <div className="p-5 bg-[#0A1F3D] border border-[#C6A256]/35 rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5EFE7]">
            Welcome to TRS Property Mall - Create Account
          </h2>
         
        </div>
        <button onClick={onClose} className="text-[#F5EFE7]/80 hover:text-[#C6A256] cursor-pointer transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
     
      
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-3">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-[#F5EFE7] mb-3">
              Select Your Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("customer");
                  formik.setFieldValue("role", "customer");
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === "customer"
                    ? "border-[#C6A256] bg-[#112B52]"
                    : "border-[#F5EFE7]/20 bg-[#212121]/95 hover:border-[#C6A256]/60"
                }`}
              >
                <User className={`h-6 w-6 mb-2 ${selectedRole === "customer" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`} />
                <span className={`text-xs font-medium ${selectedRole === "customer" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`}>
                  Customer
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole("agent");
                  formik.setFieldValue("role", "agent");
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === "agent"
                    ? "border-[#C6A256] bg-[#112B52]"
                    : "border-[#F5EFE7]/20 bg-[#212121]/95 hover:border-[#C6A256]/60"
                }`}
              >
                <Briefcase className={`h-6 w-6 mb-2 ${selectedRole === "agent" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`} />
                <span className={`text-xs font-medium ${selectedRole === "agent" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`}>
                  Agent
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole("builder");
                  formik.setFieldValue("role", "builder");
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === "builder"
                    ? "border-[#C6A256] bg-[#112B52]"
                    : "border-[#F5EFE7]/20 bg-[#212121]/95 hover:border-[#C6A256]/60"
                }`}
              >
                <Building2 className={`h-6 w-6 mb-2 ${selectedRole === "builder" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`} />
                <span className={`text-xs font-medium ${selectedRole === "builder" ? "text-[#C6A256]" : "text-[#F5EFE7]"}`}>
                  Builder
                </span>
              </button>
            </div>
            {formik.touched.role && formik.errors.role && (
              <div className="text-[#C6A256] text-sm mt-2">{formik.errors.role}</div>
            )}
          </div>

          {/* Customer Fields */}
          {selectedRole === "customer" && (
            <div className="space-y-3">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter your full name"
                  {...formik.getFieldProps("fullName")}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.fullName}</div>
                )}
              </div>
            </div>
          )}

          {/* Agent Fields */}
          {selectedRole === "agent" && (
            <>
              <label className="block text-xs font-semibold text-[#C6A256] mb-3 uppercase tracking-wide">
                Agency Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter your full name"
                  {...formik.getFieldProps("fullName")}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.fullName}</div>
                )}
              </div>

              <div>
                <label htmlFor="agencyName" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Agency Name *
                </label>
                <input
                  type="text"
                  id="agencyName"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter agency name"
                  {...formik.getFieldProps("agencyName")}
                />
                {formik.touched.agencyName && formik.errors.agencyName && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.agencyName}</div>
                )}
              </div>

              <div>
                <label htmlFor="reraNumber" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  RERA Number (Optional)
                </label>
                <input
                  type="text"
                  id="reraNumber"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter RERA registration number"
                  {...formik.getFieldProps("reraNumber")}
                />
                {formik.touched.reraNumber && formik.errors.reraNumber && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.reraNumber}</div>
                )}
              </div>

              <div>
                <label htmlFor="officeAddress" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Office Address *
                </label>
                <input
                  type="text"
                  id="officeAddress"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter office address"
                  {...formik.getFieldProps("officeAddress")}
                />
                {formik.touched.officeAddress && formik.errors.officeAddress && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.officeAddress}</div>
                )}
              </div>
            </div>
            </>
          )}

          {/* Builder Fields */}
          {selectedRole === "builder" && (
            <>
              <label className="block text-xs font-semibold text-[#C6A256] mb-3 uppercase tracking-wide">
                Company Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter company name"
                  {...formik.getFieldProps("companyName")}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.companyName}</div>
                )}
              </div>

              <div>
                <label htmlFor="contactPersonName" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter contact person name"
                  {...formik.getFieldProps("contactPersonName")}
                />
                {formik.touched.contactPersonName && formik.errors.contactPersonName && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.contactPersonName}</div>
                )}
              </div>

              <div>
                <label htmlFor="reraRegistrationNumber" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  RERA Registration Number *
                </label>
                <input
                  type="text"
                  id="reraRegistrationNumber"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter RERA registration number"
                  {...formik.getFieldProps("reraRegistrationNumber")}
                />
                {formik.touched.reraRegistrationNumber && formik.errors.reraRegistrationNumber && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.reraRegistrationNumber}</div>
                )}
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                  Company Address *
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                  placeholder="Enter company address"
                  {...formik.getFieldProps("companyAddress")}
                />
                {formik.touched.companyAddress && formik.errors.companyAddress && (
                  <div className="text-[#C6A256] text-sm mt-1">{formik.errors.companyAddress}</div>
                )}
              </div>
            </div>
            </>
          )}

          {/* Divider */}
          {selectedRole !== "customer" && (
            <div className="pt-2">
              <div className="border-t border-[#C6A256]/25 mb-3"></div>
              <label className="block text-xs font-semibold text-[#C6A256] mb-3 uppercase tracking-wide">
                Contact & Login Details
              </label>
            </div>
          )}

          {/* Common Fields for All Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                id="phone"
                maxLength={10}
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter 10-digit mobile number"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-[#C6A256] text-sm mt-1">{formik.errors.phone}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-[#C6A256] text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter your city"
                {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-[#C6A256] text-sm mt-1">{formik.errors.city}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter password (min 6 characters)"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-[#C6A256] text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 bg-[#C6A256] text-[#0A1F3D] font-semibold py-2 rounded-lg transition-all duration-300 h-10 flex items-center justify-center cursor-pointer hover:bg-[#b79345] hover:shadow-[0_0_18px_rgba(198,162,86,0.35)] border border-[#C6A256] disabled:opacity-50"
        >
            <span>
            {isLoading ? (
              <div className="animate-spin">
                <Loader />
              </div>
            ) : (
              "Create Account"
            )}
          </span>
        </button>

        <div className="mt-4 text-center">
          <p className="text-[#F5EFE7] text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveTab("sendOtp")}
              className="text-[#C6A256] hover:text-[#d9b66b] font-medium cursor-pointer transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
