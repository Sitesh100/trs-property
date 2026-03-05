"use client";
import { useDirectLoginMutation } from "@/service/authApi";
import { setToken, setUser } from "@/redux/authSlice";
import { useFormik } from "formik";
import { Loader, X, User, Briefcase, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

function SendOtpForm({ onClose, setSendOtpInfo, setActiveTab }) {
    const dispatch = useDispatch();
    const [directLogin, { isLoading }] = useDirectLoginMutation();

    const formik = useFormik({
        initialValues: {
            phone: "",
            role: "customer",
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
                .required("Mobile Number is required"),
            role: Yup.string()
                .oneOf(["customer", "agent", "builder"], "Select a valid role")
                .required("Role is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await directLogin({ 
                    phone: values.phone,
                    role: values.role 
                }).unwrap();
                
                // Handle successful login
                const token = response?.token || response?.data?.token;
                const user = response?.user || response?.data?.user;
                
                if (token && user) {
                    dispatch(setToken(token));
                    dispatch(setUser(user));
                    toast.success(response?.message || "Login successful");
                    window.dispatchEvent(new Event("resume-form-submit"));
                    onClose();
                }
            } catch (err) {
                console.log(err);
                // Check if user not found - redirect to signup
                const errorMessage = err?.data?.message || err?.data?.error || '';
                if (errorMessage.toLowerCase().includes('not found') || 
                    errorMessage.toLowerCase().includes('not registered') ||
                    errorMessage.toLowerCase().includes('please signup') ||
                    errorMessage.toLowerCase().includes('user does not exist') ||
                    errorMessage.toLowerCase().includes('please login')) {
                    toast.error("Mobile number not registered. Please complete registration to continue.");
                    // Pre-fill signup form with phone and role
                    setSendOtpInfo({
                        phone: values?.phone,
                        role: values?.role,
                    });
                    setActiveTab("signup");
                } else {
                    toast.error(errorMessage || 'Something went wrong');
                }
            }
        },
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Welcome to TRS - Login</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                            Mobile Number<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="phone"
                            maxLength={10}
                            className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter 10-digit mobile number"
                            {...formik.getFieldProps("phone")}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Select Your Role<span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Customer Option */}
                            <label className={`cursor-pointer flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                                formik.values.role === "customer" 
                                    ? "border-amber-500 bg-amber-500/10" 
                                    : "border-[#3a2a5a] hover:border-[#4a3a6a]"
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    checked={formik.values.role === "customer"}
                                    onChange={formik.handleChange}
                                    className="sr-only"
                                />
                                <User className={`h-6 w-6 mb-2 ${
                                    formik.values.role === "customer" ? "text-amber-500" : "text-gray-400"
                                }`} />
                                <span className={`text-xs font-medium ${
                                    formik.values.role === "customer" ? "text-amber-500" : "text-gray-300"
                                }`}>Customer</span>
                            </label>

                            {/* Agent Option */}
                            <label className={`cursor-pointer flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                                formik.values.role === "agent" 
                                    ? "border-amber-500 bg-amber-500/10" 
                                    : "border-[#3a2a5a] hover:border-[#4a3a6a]"
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="agent"
                                    checked={formik.values.role === "agent"}
                                    onChange={formik.handleChange}
                                    className="sr-only"
                                />
                                <Briefcase className={`h-6 w-6 mb-2 ${
                                    formik.values.role === "agent" ? "text-amber-500" : "text-gray-400"
                                }`} />
                                <span className={`text-xs font-medium ${
                                    formik.values.role === "agent" ? "text-amber-500" : "text-gray-300"
                                }`}>Agent</span>
                            </label>

                            {/* Builder Option */}
                            <label className={`cursor-pointer flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                                formik.values.role === "builder" 
                                    ? "border-amber-500 bg-amber-500/10" 
                                    : "border-[#3a2a5a] hover:border-[#4a3a6a]"
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="builder"
                                    checked={formik.values.role === "builder"}
                                    onChange={formik.handleChange}
                                    className="sr-only"
                                />
                                <Building2 className={`h-6 w-6 mb-2 ${
                                    formik.values.role === "builder" ? "text-amber-500" : "text-gray-400"
                                }`} />
                                <span className={`text-xs font-medium ${
                                    formik.values.role === "builder" ? "text-amber-500" : "text-gray-300"
                                }`}>Builder</span>
                            </label>
                        </div>
                        {formik.touched.role && formik.errors.role && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="golden-button group relative overflow-hidden w-full mt-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 font-semibold py-2.5 rounded-lg transition-all duration-300 h-11 flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-300/50 disabled:opacity-50"
                >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        {isLoading ? (
                            <div className="animate-spin">
                                <Loader />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>

                <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setActiveTab("signup")}
                            className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </form >
        </div >
    );
}

export default SendOtpForm;
