// ========================================
// 📝 THIS FILE IS DEPRECATED - OTP functionality removed
// Direct login/signup is now used without OTP verification
// ========================================

/*
import { setToken, setUser } from "@/redux/authSlice";
import { useLoginVerifyOtpMutation, useSignupVerifyOtpMutation } from "@/service/authApi";
import { Loader, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function OtpInput({ length = 6, onChange }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChange?.(newOtp.join(""));

            // Move to next input
            if (value && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevIndex = index - 1;
            inputsRef.current[prevIndex]?.focus();
        }
    };

    return (
        <div className="flex space-x-2 mt-4">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center text-lg bg-[#2a1f45] border border-[#3a2a5a] text-white rounded"
                />
            ))}
        </div>
    );
}

function VerifyOtpForm({ onClose, sendOtpInfo, setActiveTab }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [otpValue, setOtpValue] = useState("");
    const [loginVerifyOtp, { isLoading: isLoginLoading }] = useLoginVerifyOtpMutation();
    const [signupVerifyOtp, { isLoading: isSignupLoading }] = useSignupVerifyOtpMutation();

    const isLoading = isLoginLoading || isSignupLoading;
    const isSignup = sendOtpInfo?.isSignup;

    const handleOtpChange = (value) => {
        setOtpValue(value);
    };

    const handleBack = () => {
        if (isSignup) {
            setActiveTab("signup");
        } else {
            setActiveTab("sendOtp");
        }
    };

    const handlerVerifyOtp = async () => {
        if (!otpValue || otpValue.length < 6) return toast.error("Please enter 6-digit OTP");
        
        try {
            let response;
            
            if (isSignup) {
                // Signup flow - use signupVerifyOtp
                response = await signupVerifyOtp({
                    fullName: sendOtpInfo?.fullName,
                    phone: sendOtpInfo?.phone,
                    otp: otpValue,
                    role: sendOtpInfo?.role,
                }).unwrap();
            } else {
                // Login flow - use loginVerifyOtp
                response = await loginVerifyOtp({
                    otp: otpValue,
                    phone: sendOtpInfo?.phone,
                }).unwrap();
            }

            if (response?.success || response?.token) {
                // New API returns token directly in response
                const token = response?.token || response?.data?.token;
                const user = response?.user || response?.data?.user || { 
                    phone: sendOtpInfo?.phone, 
                    role: sendOtpInfo?.role,
                    fullName: sendOtpInfo?.fullName,
                };
                
                dispatch(setToken(token));
                dispatch(setUser(user));
                toast.success(response?.message || (isSignup ? "Signup successful" : "Login successful"));
                window.dispatchEvent(new Event("resume-form-submit"));
                onClose();
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || 'Invalid OTP. Please try again.');
        }
    }

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleBack} 
                            className="text-gray-400 hover:text-white cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-white">
                            {isSignup ? "Verify Signup OTP" : "Verify Login OTP"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <p className="text-gray-400 text-sm text-center mb-4">
                    OTP sent to <span className="text-white font-medium">{sendOtpInfo?.phone}</span>
                </p>

                <div className="mt-6 flex flex-col justify-start items-center space-y-4">
                    <label className="block text-sm font-medium text-gray-300">Enter 6-digit OTP</label>
                    <OtpInput onChange={handleOtpChange} />
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handlerVerifyOtp}
                        className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="animate-spin">
                                <Loader />
                            </div>
                        ) : (
                            isSignup ? "Create Account" : "Verify & Login"
                        )}
                    </button>
                </div>
            </div>

        </>
    );
}

export default VerifyOtpForm;
*/

// Placeholder export to prevent import errors
export default function VerifyOtpForm() {
    return null;
}
