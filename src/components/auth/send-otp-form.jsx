"use client";
import { useLoginMutation } from "@/service/authApi";
import { setToken, setUser } from "@/redux/authSlice";
import { useFormik } from "formik";
import { Loader, X, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { newBasedUrl } from "@/libs/based-url";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "@/utils/authCookies";

const normalizeUserRole = (roleValue) => {
    if (!roleValue) return "";
    return String(roleValue).trim().toLowerCase();
};

const getRoleDashboardRoute = (roleValue) => {
    const role = normalizeUserRole(roleValue);
    if (role.includes("builder")) return "/builder-panel";
    if (role.includes("agent") || role.includes("consultant")) return "/";
    return "";
};

function SendOtpForm({ onClose, setSendOtpInfo, setActiveTab, sendOtpInfo }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: sendOtpInfo?.phone || sendOtpInfo?.email || "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .matches(/^\d{10}$/, "Please enter a valid 10-digit mobile number")
                .required("Mobile number is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await login({ 
                    username: values.username,
                    phone: values.username,
                    password: values.password 
                }).unwrap();
                
                console.log("✅ Login successful:", response);
                
                // Handle successful login
                const token = response?.access_token || response?.token;
                const roleFromLogin = response?.role || response?.user?.role;
                let resolvedRole = normalizeUserRole(roleFromLogin);
                
                if (token) {
                    // Store token
                    dispatch(setToken(token));
                    
                    // Create user object with available data
                    const user = {
                        phone: values.username,
                        role: resolvedRole || "customer",
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
                                resolvedRole = normalizeUserRole(
                                    profileData?.role || profileData?.user_role || resolvedRole
                                );
                            }
                        }
                    } catch (profileErr) {
                        console.error("Profile fetch after login failed:", profileErr);
                    }

                    toast.success("Login successful!");
                    setAuthCookies({ token, role: resolvedRole || "customer" });
                    window.dispatchEvent(new Event("resume-form-submit"));
                    onClose();

                    const dashboardRoute = getRoleDashboardRoute(resolvedRole);
                    if (dashboardRoute) {
                        router.push(dashboardRoute);
                    }
                } else {
                    toast.error("Invalid response from server");
                }
            } catch (err) {
                console.error("❌ Login error:", err);
                
                // Handle error response
                const errorDetail = err?.data?.detail || err?.data?.message || err?.data?.error || '';

                const lowerError = errorDetail.toLowerCase();
                const isCredentialError =
                    lowerError.includes('invalid email') ||
                    lowerError.includes('invalid username') ||
                    lowerError.includes('invalid phone') ||
                    lowerError.includes('not found') ||
                    lowerError.includes('not registered') ||
                    lowerError.includes('invalid password') ||
                    lowerError.includes('incorrect password') ||
                    lowerError.includes('invalid credential') ||
                    lowerError.includes('invalid credentials');

                if (isCredentialError) {
                    toast.error('Invalid credentials');
                } else {
                    toast.error(errorDetail || 'Login failed. Please try again.');
                }
            }
        },
    });

    return (
        <div className="p-6 bg-[#0A1F3D] border border-[#C6A256]/35 rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#F5EFE7]">Welcome Back to TRS Property Mall</h2>
                   
                </div>
                <button onClick={onClose} className="text-[#F5EFE7]/80 hover:text-[#C6A256] cursor-pointer transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>
            
            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                    {/* Mobile Number Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                            Mobile Number<span className="text-[#C6A256]">*</span>
                        </label>
                        <input
                            type="tel"
                            id="username"
                            className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                            placeholder="Enter your 10-digit mobile number"
                            inputMode="numeric"
                            maxLength={10}
                            {...formik.getFieldProps("username")}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.username}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                            Password<span className="text-[#C6A256]">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-3 py-2 pr-10 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                                placeholder="Enter your password"
                                {...formik.getFieldProps("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5EFE7]/70 hover:text-[#C6A256] cursor-pointer transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.password}</div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-[#C6A256] text-[#0A1F3D] font-semibold py-2.5 rounded-lg transition-all duration-300 h-11 flex items-center justify-center cursor-pointer hover:bg-[#b79345] hover:shadow-[0_0_18px_rgba(198,162,86,0.35)] border border-[#C6A256] disabled:opacity-50"
                >
                    <span>
                        {isLoading ? (
                            <div className="animate-spin">
                                <Loader />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </span>
                </button>

                <div className="mt-4 text-center">
                    <p className="text-[#F5EFE7] text-sm">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setActiveTab("signup")}
                            className="text-[#C6A256] hover:text-[#d9b66b] font-medium cursor-pointer transition-colors"
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
