"use client";
import { useLoginMutation } from "@/service/authApi";
import { setToken, setUser } from "@/redux/authSlice";
import { useFormik } from "formik";
import { Loader, X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { newBasedUrl } from "@/libs/based-url";

function SendOtpForm({ onClose, setSendOtpInfo, setActiveTab, sendOtpInfo }) {
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: sendOtpInfo?.email || "", // email address pre-filled from registration
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .email("Please enter a valid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await login({ 
                    username: values.username, // phone number
                    password: values.password 
                }).unwrap();
                
                console.log("✅ Login successful:", response);
                
                // Handle successful login
                const token = response?.access_token || response?.token;
                const role = response?.role;
                
                if (token) {
                    // Store token
                    dispatch(setToken(token));
                    
                    // Create user object with available data
                    const user = {
                        email: values.username,
                        role: role || "customer",
                    };
                    
                    dispatch(setUser(user));

                    // Hydrate full profile immediately so navbar avatar updates right after login.
                    try {
                        const profileResponse = await fetch(`${newBasedUrl}/api/customer/profile`, {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (profileResponse.ok) {
                            const payload = await profileResponse.json();
                            const profileData = payload?.data || payload?.result || payload;

                            if (profileData && typeof profileData === "object") {
                                dispatch(setUser(profileData));
                            }
                        }
                    } catch (profileErr) {
                        console.error("Profile fetch after login failed:", profileErr);
                    }

                    toast.success("Login successful!");
                    window.dispatchEvent(new Event("resume-form-submit"));
                    onClose();
                } else {
                    toast.error("Invalid response from server");
                }
            } catch (err) {
                console.error("❌ Login error:", err);
                
                // Handle error response
                const errorDetail = err?.data?.detail || err?.data?.message || err?.data?.error || '';
                
                if (errorDetail.toLowerCase().includes('invalid email') || 
                    errorDetail.toLowerCase().includes('invalid phone') || 
                    errorDetail.toLowerCase().includes('not found') ||
                    errorDetail.toLowerCase().includes('not registered')) {
                    toast.error("Email not registered. Please sign up first.");
                    setActiveTab("signup");
                } else if (errorDetail.toLowerCase().includes('invalid password') ||
                           errorDetail.toLowerCase().includes('incorrect password')) {
                    toast.error("Invalid password. Please try again.");
                } else {
                    toast.error(errorDetail || 'Login failed. Please try again.');
                }
            }
        },
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Welcome Back to TRS</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="username"
                            className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter your email address"
                            {...formik.getFieldProps("username")}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-3 py-2 pr-10 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Enter your password"
                                {...formik.getFieldProps("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
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
