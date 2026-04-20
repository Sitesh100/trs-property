"use client";

import { useResetPasswordMutation } from "@/service/authApi";
import { useFormik } from "formik";
import { Eye, EyeOff, Loader, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

function ForgotPasswordForm({ onClose, setActiveTab, sendOtpInfo }) {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: sendOtpInfo?.phone || "",
      otp: "",
      new_password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^\d{10}$/, "Please enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
      otp: Yup.string()
        .matches(/^\d{4,6}$/, "Please enter a valid OTP")
        .required("OTP is required"),
      new_password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    }),
    onSubmit: async (values) => {
      if (!isOtpVerified) {
        toast.error("Please verify OTP before resetting password.");
        return;
      }

      try {
        const response = await resetPassword(values).unwrap();
        toast.success(response?.message || "Password reset successful. Please login.");
        setActiveTab("sendOtp");
      } catch (err) {
        const errorMessage =
          err?.data?.detail ||
          err?.data?.message ||
          err?.data?.error ||
          "Unable to reset password. Please try again.";
        toast.error(errorMessage);
      }
    },
  });

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(formik.values.phone || "")) {
      formik.setFieldTouched("phone", true);
      toast.error("Please enter a valid 10-digit mobile number first.");
      return;
    }

    toast.success("OTP sent successfully.");
  };

  const handleVerifyOtp = () => {
    if (!/^\d{4,6}$/.test(formik.values.otp || "")) {
      formik.setFieldTouched("otp", true);
      toast.error("Please enter a valid OTP.");
      return;
    }

    setIsOtpVerified(true);
    toast.success("OTP verified successfully.");
  };

  return (
    <div className="p-6 bg-[#0A1F3D] border border-[#C6A256]/35 rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#F5EFE7]">Forgot Password</h2>
          {/* <p className="text-[#F5EFE7]/70 text-sm mt-1">Enter your mobile, OTP, and new password.</p> */}
        </div>
        <button onClick={onClose} className="text-[#F5EFE7]/80 hover:text-[#C6A256] cursor-pointer transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#F5EFE7] mb-1">
              Mobile Number<span className="text-[#C6A256]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter your 10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                {...formik.getFieldProps("phone")}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-3 py-2 rounded-md border border-[#C6A256]/60 text-[#C6A256] text-sm font-medium hover:bg-[#C6A256]/10 transition-colors whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-[#C6A256] text-xs mt-1">{formik.errors.phone}</div>
            )}
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[#F5EFE7] mb-1">
              OTP<span className="text-[#C6A256]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="otp"
                className="w-full px-3 py-2 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter OTP"
                inputMode="numeric"
                maxLength={6}
                value={formik.values.otp}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  if (isOtpVerified) {
                    setIsOtpVerified(false);
                  }
                  formik.handleChange(e);
                }}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-3 py-2 rounded-md border border-[#C6A256] text-[#C6A256] text-sm font-medium hover:bg-[#C6A256]/10 transition-colors whitespace-nowrap"
              >
                Verify
              </button>
            </div>
            {isOtpVerified && (
              <div className="text-green-400 text-xs mt-1">OTP is verified.</div>
            )}
            {formik.touched.otp && formik.errors.otp && (
              <div className="text-[#C6A256] text-xs mt-1">{formik.errors.otp}</div>
            )}
          </div>

          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-[#F5EFE7] mb-1">
              New Password<span className="text-[#C6A256]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="new_password"
                className="w-full px-3 py-2 pr-10 bg-[#212121]/95 border border-[#F5EFE7]/25 rounded-md text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:outline-none focus:ring-2 focus:ring-[#C6A256]/60 focus:border-[#C6A256]"
                placeholder="Enter your new password"
                {...formik.getFieldProps("new_password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5EFE7]/70 hover:text-[#C6A256] cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formik.touched.new_password && formik.errors.new_password && (
              <div className="text-[#C6A256] text-xs mt-1">{formik.errors.new_password}</div>
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
              "Reset Password"
            )}
          </span>
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setActiveTab("sendOtp")}
            className="text-[#C6A256] hover:text-[#d9b66b] font-medium cursor-pointer transition-colors"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
